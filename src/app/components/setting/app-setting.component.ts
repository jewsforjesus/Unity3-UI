import { Component, OnInit } from '@angular/core';
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
  library: Library;

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
      this.library = result;
      }
    );
  }

  saveByteArray() {
    // var blob = new Blob([this.library.file],{type:this.library.contentType});
    // var link = document.createElement('a');
    // link.href = window.URL.createObjectURL(blob);
    // link.download = this.library.filename;
    // link.click();

    //var contentType = headers["content-type"] || "application/octet-stream";
    var urlCreator = window.URL || window.webkitURL;// || window.mozURL || window.msURL;
    if (urlCreator) {
        var blob = new Blob([this.library.file], { type: this.library.contentType });
        var url = urlCreator.createObjectURL(blob);
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style.content = "display: none";
        a.href = url;
        a.download = this.library.filename; //you may assign this value from header as well 
        a.click();
        window.URL.revokeObjectURL(url);
    }


  }






}
