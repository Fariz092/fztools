/**
 * Lightweight, client-side GIF89a encoder for canvas animations (.bratgif)
 * Encodes multiple ImageData frames into a downloadable GIF Blob.
 */
export interface GifFrameOptions {
  delayMs?: number; // per-frame delay in milliseconds
}

export class SimpleGifEncoder {
  private width: number;
  private height: number;
  private frames: { data: Uint8ClampedArray; delay: number }[] = [];

  constructor(width: number, height: number) {
    this.width = Math.floor(width);
    this.height = Math.floor(height);
  }

  addFrame(ctx: CanvasRenderingContext2D, delayMs = 150) {
    const imgData = ctx.getImageData(0, 0, this.width, this.height);
    this.frames.push({
      data: imgData.data,
      delay: Math.max(20, delayMs),
    });
  }

  // Generate GIF Blob
  generateBlob(): Blob {
    const stream: number[] = [];

    // Header & Logical Screen Descriptor
    this.writeString(stream, 'GIF89a');
    this.writeShort(stream, this.width);
    this.writeShort(stream, this.height);

    // Global color table: 256 colors palette
    // 0x80 (GCT flag) | 0x70 (8 bits/pixel) | 0x07 (256 entries = 2^(7+1))
    stream.push(0xf7); // GCT follows, 256 colors
    stream.push(0); // background color index
    stream.push(0); // pixel aspect ratio

    // Build adaptive/web-safe 256 color palette (6x6x6 RGB cube + 40 grayscales)
    const palette: number[][] = [];
    for (let r = 0; r < 6; r++) {
      for (let g = 0; g < 6; g++) {
        for (let b = 0; b < 6; b++) {
          palette.push([
            Math.round((r * 255) / 5),
            Math.round((g * 255) / 5),
            Math.round((b * 255) / 5),
          ]);
        }
      }
    }
    // Fill remaining 40 slots with grayscale
    for (let i = 0; i < 40; i++) {
      const v = Math.round((i * 255) / 39);
      palette.push([v, v, v]);
    }

    // Write palette (256 * 3 bytes)
    for (let i = 0; i < 256; i++) {
      const color = palette[i] || [0, 0, 0];
      stream.push(color[0], color[1], color[2]);
    }

    // Netscape Application Extension for looping animation
    stream.push(0x21); // Extension Introducer
    stream.push(0xff); // Application Extension Label
    stream.push(11); // Block Size
    this.writeString(stream, 'NETSCAPE2.0');
    stream.push(3); // Sub-block length
    stream.push(1); // loop sub-block id
    this.writeShort(stream, 0); // Loop count (0 = infinite)
    stream.push(0); // Block Terminator

    // Process each frame
    for (const frame of this.frames) {
      // Graphics Control Extension
      stream.push(0x21); // Extension Introducer
      stream.push(0xf9); // GCE Label
      stream.push(4); // Byte size
      stream.push(0x04); // Packed field: disposal method 1 (do not dispose)
      const delayInCentiseconds = Math.round(frame.delay / 10);
      this.writeShort(stream, delayInCentiseconds);
      stream.push(0); // Transparent color index
      stream.push(0); // Block Terminator

      // Image Descriptor
      stream.push(0x2c); // Image Separator
      this.writeShort(stream, 0); // Image Left
      this.writeShort(stream, 0); // Image Top
      this.writeShort(stream, this.width);
      this.writeShort(stream, this.height);
      stream.push(0x00); // Local Color Table Flag (none, use Global)

      // Map frame RGBA pixels to nearest palette index
      const pixelIndices: number[] = [];
      const data = frame.data;
      const totalPixels = this.width * this.height;

      for (let i = 0; i < totalPixels; i++) {
        const offset = i * 4;
        const r = data[offset];
        const g = data[offset + 1];
        const b = data[offset + 2];

        // Fast nearest color lookup in 6x6x6 cube
        const ri = Math.min(5, Math.floor((r + 25) / 51));
        const gi = Math.min(5, Math.floor((g + 25) / 51));
        const bi = Math.min(5, Math.floor((b + 25) / 51));
        const idx = ri * 36 + gi * 6 + bi;
        pixelIndices.push(idx);
      }

      // LZW Compress image data
      this.writeLzwData(stream, pixelIndices);
    }

    // GIF Trailer
    stream.push(0x3b);

    return new Blob([new Uint8Array(stream)], { type: 'image/gif' });
  }

  private writeString(stream: number[], str: string) {
    for (let i = 0; i < str.length; i++) {
      stream.push(str.charCodeAt(i));
    }
  }

  private writeShort(stream: number[], num: number) {
    stream.push(num & 0xff);
    stream.push((num >> 8) & 0xff);
  }

  private writeLzwData(stream: number[], pixels: number[]) {
    const minCodeSize = 8;
    stream.push(minCodeSize);

    const clearCode = 1 << minCodeSize; // 256
    const eoiCode = clearCode + 1; // 257

    let codeSize = minCodeSize + 1;
    let nextCode = eoiCode + 1;
    let codeTable: Map<string, number> = new Map();

    const resetTable = () => {
      codeTable.clear();
      for (let i = 0; i < clearCode; i++) {
        codeTable.set(String.fromCharCode(i), i);
      }
      codeSize = minCodeSize + 1;
      nextCode = eoiCode + 1;
    };

    resetTable();

    let curBits = 0;
    let curAccum = 0;
    const packet: number[] = [];

    const flushPacket = () => {
      if (packet.length > 0) {
        stream.push(packet.length);
        for (const byte of packet) {
          stream.push(byte);
        }
        packet.length = 0;
      }
    };

    const writeCode = (code: number) => {
      curAccum |= code << curBits;
      curBits += codeSize;
      while (curBits >= 8) {
        packet.push(curAccum & 0xff);
        curAccum >>= 8;
        curBits -= 8;
        if (packet.length === 254) {
          flushPacket();
        }
      }
    };

    writeCode(clearCode);

    let prefix = '';
    for (let i = 0; i < pixels.length; i++) {
      const c = String.fromCharCode(pixels[i]);
      const pc = prefix + c;
      if (codeTable.has(pc)) {
        prefix = pc;
      } else {
        writeCode(codeTable.get(prefix)!);
        if (nextCode < 4096) {
          codeTable.set(pc, nextCode++);
          if (nextCode > (1 << codeSize) && codeSize < 12) {
            codeSize++;
          }
        } else {
          writeCode(clearCode);
          resetTable();
        }
        prefix = c;
      }
    }

    if (prefix.length > 0) {
      writeCode(codeTable.get(prefix)!);
    }

    writeCode(eoiCode);

    if (curBits > 0) {
      packet.push(curAccum & 0xff);
    }
    flushPacket();
    stream.push(0); // Sub-block terminator
  }
}
