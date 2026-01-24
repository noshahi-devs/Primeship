import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { CarouselModule } from 'primeng/carousel';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { PriceComponent } from './components/price/price.component';

@NgModule({
  declarations: [
    ProductCardComponent,
    PriceComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    RatingModule,
    CarouselModule,
    FormsModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    RatingModule,
    CarouselModule,
    FormsModule,
    ProductCardComponent,
    PriceComponent
  ]
})
export class SharedModule { }
