import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSetting, Article, Library } from 'src/app/models/app-setting.model';
import { AppSettingService } from 'src/app/services/app-setting.service';

@Component({
  selector: 'app-setting',
  templateUrl: './app-setting.component.html'
})


export class AppSettingComponent implements OnInit {

  constructor(private settingsService: AppSettingService) {
  }

  setting: AppSetting;

  article: Article;
  libraries: Library[];

  ngOnInit() {
    
    this.load();

    this.loadArticle();
    this.loadLibrary();

  }

  load(): void {
    this.settingsService.load().subscribe(result => {
      this.setting = result;
      }
    );
  }

  loadArticle(): void {
    this.settingsService.loadArticles().subscribe(result => {
      this.article = result;
      }
    );
  }

  loadLibrary(): void {
    this.settingsService.loadLibraries().subscribe(result => {
      this.libraries = result;
      }
    );
  }

  downloadFile(id: string, filename: string) {
    
    var urlCreator = window.URL || window.webkitURL;
    this.settingsService.downloadLibrary(id).subscribe( blob => {
      var url = urlCreator.createObjectURL(blob);
          var a = document.createElement("a");
          document.body.appendChild(a);
          a.style.content = "display: none";
          a.href = url;
          a.download = filename; 
          a.click();
          window.URL.revokeObjectURL(url);
    });    


  }

}
