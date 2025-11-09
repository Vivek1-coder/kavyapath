// app/api/transliterate/route.ts
import { NextRequest, NextResponse } from 'next/server';
// @ts-expect-error: sanscript has no TypeScript definitions
import Sanscript from 'sanscript';

// Function to detect if text is in Roman script (English/Hinglish)
function isRomanScript(text: string): boolean {
  // Check if text contains significant Latin characters
  const latinChars = text.match(/[a-zA-Z]/g);
  return latinChars ? latinChars.length > text.length * 0.3 : false;
}

// Function to translate using Google Translate API (free method)
async function translateToHindi(text: string): Promise<string> {
  try {
    // Using Google Translate free API with better headers
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encodeURIComponent(text)}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Translation API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract translated text from response
    if (data && data[0] && Array.isArray(data[0])) {
      const translatedText = data[0]
        .filter((item: any) => item && item[0])
        .map((item: any) => item[0])
        .join('');
      
      if (translatedText && translatedText.trim()) {
        return translatedText;
      }
    }
    
    throw new Error('Invalid translation response');
  } catch (error) {
    console.error('Translation error:', error);
    throw error; // Re-throw to allow fallback
  }
}

// Function for transliteration (Roman to Devanagari)
function transliterateToHindi(text: string): string {
  try {
    return Sanscript.t(text, 'itrans', 'devanagari');
  } catch (error) {
    console.error('Transliteration error:', error);
    return text;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { romanText, mode = 'auto' } = body;

  if (!romanText) {
    return NextResponse.json({ error: 'Missing romanText' }, { status: 400 });
  }

  let hindi = romanText;

  try {
    // Determine the best approach based on mode
    if (mode === 'translate' || mode === 'auto') {
      // Try translation first for better results with proper English
      try {
        hindi = await translateToHindi(romanText);
      } catch (translateError) {
        console.log('Translation failed, attempting transliteration:', translateError);
        // If translation fails, try transliteration as fallback
        if (mode === 'auto') {
          hindi = transliterateToHindi(romanText);
        }
      }
    } else if (mode === 'transliterate') {
      // Use transliteration for Hinglish/phonetic text
      hindi = transliterateToHindi(romanText);
    }

    return NextResponse.json({ 
      hindi,
      original: romanText,
      mode: mode === 'auto' ? (hindi !== romanText ? 'translated' : 'original') : mode
    });
  } catch (error) {
    console.error('Error processing text:', error);
    
    // Last resort fallback
    return NextResponse.json({ 
      hindi: romanText,
      original: romanText,
      mode: 'fallback',
      error: 'Processing failed, returning original text'
    }, { status: 200 }); // Return 200 so client can still use original text
  }
}
