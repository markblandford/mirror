import { Injectable } from '@angular/core';
import OpenAI from 'openai';
import { APIPromise } from 'openai/core';
import { environment } from '../environments/environment';

export type ImageSize = '256x256' | '512x512' | '1024x1024' | null | undefined

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {
  private openai!: OpenAI;

  constructor() {
    this.init();
  }

  public async createImageVariation(imageUrl: string, size: ImageSize = '512x512'): Promise<APIPromise<any>> {
    const image = await this.createUploadableImage(imageUrl);

    return this.openai?.images.createVariation(
      {
        image,
        n: 1,
        size,
        response_format: 'url',
      }
    ).withResponse();
  }

  private init() {
    this.openai = new OpenAI({
      apiKey: environment.openai_apiKey,
      dangerouslyAllowBrowser: true,
    });
  }

  public createUploadableImage(imageUrl: string): any {
    return fetch(imageUrl);

    // return new File([image], 'canvas.png', { type: 'image/png' });
  }
}
