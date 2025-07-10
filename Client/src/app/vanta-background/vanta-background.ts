import { Component, ElementRef, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import * as THREE from 'three';
import GLOBE from 'vanta/dist/vanta.globe.min';

@Component({
  selector: 'app-vanta-background',
  template: `
    <div #vantaRef style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1;"></div>
  `,
})
export class VantaBackgroundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('vantaRef', { static: true }) vantaRef!: ElementRef;
  private vantaEffect: any;

  ngAfterViewInit(): void {
    this.vantaEffect = GLOBE({
      el: this.vantaRef.nativeElement,
      THREE: THREE,
      mouseControls: true,
  touchControls: true,
  gyroControls: false,
  minHeight: 200.00,
  minWidth: 200.00,
  scale: 1.00,
  scaleMobile: 1.00,
  color2: 0x870909,
  size: 1.60,
  backgroundColor: 0xe6e6e6
    });
  }
  

  ngOnDestroy(): void {
    if (this.vantaEffect) this.vantaEffect.destroy();
  }
}
