import { Component, ElementRef, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';

declare global {
  interface Window {
    VANTA: any;
    THREE: any;
  }
}

@Component({
  selector: 'app-birds-background',
  template: `<div #vantaRef class="birds-container"></div>`,
  styles: [`
    .birds-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: -1;
    }
  `]
})
export class BirdsBackgroundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('vantaRef', { static: true }) vantaRef!: ElementRef;
  private vantaEffect: any;

  ngAfterViewInit(): void {
    // Wait until VANTA and THREE are loaded
    if (window.VANTA && window.VANTA.BIRDS && window.THREE) {
      this.vantaEffect = window.VANTA.BIRDS({
        el: this.vantaRef.nativeElement,
        THREE: window.THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        backgroundColor: 0xf7f7f7,
        color1: 0xf0c957,
        color2: 0xdedede,
        colorMode: "lerpGradient",
        birdSize: 1.60,
        wingSpan: 28.00,
        speedLimit: 4.00,
        separation: 69.00,
        alignment: 51.00,
        cohesion: 59.00,
        backgroundAlpha: 0.73
      });
    }
  }

  ngOnDestroy(): void {
    if (this.vantaEffect) this.vantaEffect.destroy();
  }
}
