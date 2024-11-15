import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [
    NgClass,
    NgStyle
  ],
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.scss'
})
export class CameraComponent implements AfterViewInit {
  WIDTH = 512;
  HEIGHT = 512;

  @ViewChild('video',{ static: true })
  public video!: ElementRef;

  @ViewChild('canvas', { static: true })
  public canvas!: ElementRef;

  captures: string[] = [];
  error: any = null;
  isCaptured = false;

  async ngAfterViewInit() {
    await this.setupDevices();
  }

  async setupDevices() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
        if (stream) {
          this.video.nativeElement.srcObject = stream;
          this.video.nativeElement.play();
          this.error = null;
        } else {
          this.error = "You have no output video device";
        }
      } catch (e) {
        this.error = e;
      }
    }
  }

  capture() {
    this.drawImageToCanvas(this.video.nativeElement);
    this.isCaptured = true;
  }

  removeCurrent() {
    this.isCaptured = false;
  }

  drawImageToCanvas(image: ElementRef<HTMLVideoElement>) {
    this.canvas.nativeElement
      .getContext("2d")
      .drawImage(image, 0, 0);
  }

}
