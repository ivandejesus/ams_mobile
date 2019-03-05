import { Directive, ElementRef, OnInit, HostListener } from "ngx-onsenui";
import { NgControl } from "@angular/forms";

@Directive({
  selector: '[fileInput]'
})
export class FileInputDirective implements OnInit {
  constructor(private el: ElementRef) {
    
  }

  ngOnInit(): void {
    this.el.nativeElement.style.cssText = `
      width: 0.1px;
      height: 0.1px;
      opacity: 0;
      overflow: hidden;
      position: absolute;
      z-index: -1;
    `;
    
    this.el.nativeElement.insertAdjacentHTML('afterend', '<label for="file"><p class="gradient-yellow font-sm white btn-sm">Choose file</p> <span class="file-name gray"></span></label> ');
  }

  @HostListener('change', ['$event'])
  onFileChange(event: any): void {
    if(event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      const label = this.el.nativeElement.nextSibling.children[1];

      label.innerHTML = file.name;
    }
  }
}