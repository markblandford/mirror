import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CameraComponent } from '../camera/camera.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet, CameraComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'mirror';
}
