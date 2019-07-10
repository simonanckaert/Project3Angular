import { Component } from '@angular/core';
import * as firebase from 'firebase';
import { firebaseAndroidConfig } from 'src/environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mindfulness';
  ngOnInit() {
    firebase.initializeApp(firebaseAndroidConfig)
  }
}
