/**
 * Lightweight, zero-dependency in-browser animated GIF89a encoder.
 * Encodes canvas ImageData frames into a standard animated GIF blob.
 */

export interface GifFrameOptions {
  delayMs?: number; // frame delay in milliseconds (default 100ms)
}

export class SimpleGifEncoder {
  private width: number;
  private height: number;
  private delay100ths: number;
  private output: number[] = [];

  constructor(width: number, height: number, delayMs: number = 100) {
    this.width = width;
    this.height = height;
    this.delay100ths = Math.max(2, Math.round(delayMs / 10));
    this.initHeader();
  }

  private writeByte(b: number) {
    this.output.push(b & 0xff);
  }

  private writeWord(w: number) {
    this.output.push(w & 0xff);
    this.output.push((w >> 8) & 0xff);
  }

  private writeString(s: string) {
    for (let i = 0; i < s.length; i++) {
      this.writeByte(s.charCodeAt(i));
    }
  }

  private writeBytes(bytes: number[] | Uint8Array) {
    for (let i = 0; i < bytes.length; i++) {
      this.output.push(bytes[i] & 0xff);
    }
  }

  private initHeader() {
    // GIF89a Header
    this.writeString('GIF89a');

    // Logical Screen Descriptor
    this.writeWord(this.width);
    this.writeWord(this.height);
    // Packed field: GCT flag = 0 (we use Local Color Tables per frame), Color Res = 7 (8 bits), Sort = 0, GCT size = 0
    this.writeByte(0x70);
    this.writeByte(0); // background color index
    this.writeByte(0); // pixel aspect ratio

    // Netscape 2.0 Loop Extension (Infinite Loop)
    this.writeByte(0x21); // Extension Introducer
    this.writeByte(0xff); // Application Extension Label
    this.writeByte(0x0b); // Block Size (11 bytes)
    this.writeString('NETSCAPE2.0');
    this.writeByte(0x03); // Sub-block length
    this.writeByte(0x01); // Sub-block ID (loop count)
    this.writeWord(0); // 0 = Infinite loop
    this.writeByte(0x00); // Block Terminator
  }

  /**
   * Add a frame from Canvas ImageData
   */
  public addFrame(imageData: ImageData, customDelayMs?: number) {
    const delay = customDelayMs
      ? Math.max(2, Math.round(customDelayMs / 10))
      : this.delay100ths;
    const { palette, indexedPixels } = this.quantize(imageData.data);

    // Graphic Control Extension
    this.writeByte(0x21); // Extension Introducer
    this.writeByte(0xf9); // Graphic Control Label
    this.writeByte(0x04); // Block Size
    this.writeByte(0x08); // Packed field: Disposal Method = 2 (restore to background), no transparent color
    this.writeWord(delay); // Delay time (in 1/100ths of second)
    this.writeByte(0); // Transparent color index
    this.writeByte(0x00); // Block Terminator

    // Image Descriptor
    this.writeByte(0x2c); // Image Separator
    this.writeWord(0); // Image Left
    this.writeWord(0); // Image Top
    this.writeWord(this.width);
    this.writeWord(this.height);

    // Local Color Table packed: LCT Flag = 1, Interlace = 0, Sort = 0, Size = 7 (256 colors)
    this.writeByte(0x87);

    // Write 256 RGB colors (768 bytes)
    for (let i = 0; i < 256; i++) {
      const col = palette[i] || [0, 0, 0];
      this.writeByte(col[0]);
      this.writeByte(col[1]);
      this.writeByte(col[2]);
    }

    // LZW Raster Data
    this.compressLZW(indexedPixels, 8);
  }

  /**
   * Fast uniform 3-3-2 color quantization with 256 palette entries
   */
  private quantize(rgba: Uint8ClampedArray): {
    palette: [number, number, number][];
    indexedPixels: Uint8Array;
  } {
    const numPixels = this.width * this.height;
    const indexedPixels = new Uint8Array(numPixels);
    const palette: [number, number, number][] = new Array(256);

    // Generate fixed 3-3-2 palette (8 red, 8 green, 4 blue levels)
    for (let i = 0; i < 256; i++) {
      const r = Math.round(((i >> 5) & 0x07) * (255 / 7));
      const g = Math.round(((i >> 2) & 0x07) * (255 / 7));
      const b = Math.round((i & 0x03) * (255 / 3));
      palette[i] = [r, g, b];
    }

    // Map each RGBA pixel to nearest 3-3-2 color index
    for (let i = 0; i < numPixels; i++) {
      const offset = i * 4;
      const r = rgba[offset];
      const g = rgba[offset + 1];
      const b = rgba[offset + 2];

      const rIndex = (r * 7 + 127) / 255 | 0;
      const gIndex = (g * 7 + 127) / 255 | 0;
      const bIndex = (b * 3 + 127) / 255 | 0;

      indexedPixels[i] = (rIndex << 5) | (gIndex << 2) | bIndex;
    }

    return { palette, indexedPixels };
  }

  /**
   * Standard LZW Compression for GIF
   */
  private compressLZW(pixels: Uint8Array, minCodeSize: number) {
    this.writeByte(minCodeSize); // Minimum code size

    const clearCode = 1 << minCodeSize;
    const eoiCode = clearCode + 1;
    let codeSize = minCodeSize + 1;
    let maxCode = (1 << codeSize) - 1;

    let table: { [key: string]: number } = Object.create(null);
    let nextCode = eoiCode + 1;

    const resetTable = () => {
      table = Object.create(null);
      for (let i = 0; i < clearCode; i++) {
        table[String(i)] = i;
      }
      nextCode = eoiCode + 1;
      codeSize = minCodeSize + 1;
      maxCode = (1 << codeSize) - 1;
    };

    resetTable();

    let curBits = 0;
    let curAcc = 0;
    const packet: number[] = [];

    const sendBits = (code: number) => {
      curAcc |= code << curBits;
      curBits += codeSize;
      while (curBits >= 8) {
        packet.push(curAcc & 0xff);
        curAcc >>= 8;
        curBits -= 8;
        if (packet.length === 254) {
          this.writeByte(packet.length);
          this.writeBytes(packet);
          packet.length = 0;
        }
      }
    };

    const flushBits = () => {
      if (curBits > 0) {
        packet.push(curAcc & 0xff);
        curAcc = 0;
        curBits = 0;
      }
      if (packet.length > 0) {
        this.writeByte(packet.length);
        this.writeBytes(packet);
        packet.length = 0;
      }
    };

    sendBits(clearCode);

    if (pixels.length === 0) {
      sendBits(eoiCode);
      flushBits();
      this.writeByte(0x00);
      return;
    }

    let prefix = String(pixels[0]);

    for (let i = 1; i < pixels.length; i++) {
      const c = pixels[i];
      const entry = prefix + ',' + c;

      if (table[entry] !== undefined) {
        prefix = entry;
      } else {
        sendBits(table[prefix]);

        if (nextCode <= 4095) {
          table[entry] = nextCode++;
          if (nextCode > maxCode && codeSize < 12) {
            codeSize++;
            maxCode = (1 << codeSize) - 1;
          }
        } else {
          sendBits(clearCode);
          resetTable();
        }
        prefix = String(c);
      }
    }

    sendBits(table[prefix]);
    sendBits(eoiCode);
    flushBits();
    this.writeByte(0x00); // Block Terminator
  }

  /**
   * Finalize and return Blob of type image/gif
   */
  public finish(): Blob {
    this.writeByte(0x3b); // GIF Trailer
    const uint8 = new Uint8Array(this.output);
    return new Blob([uint8], { type: 'image/gif' });
  }
}
