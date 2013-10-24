/// <reference path="ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>

module VisTrend {
  export interface Article {
    category : string;
    year : number;
    metrics : any;
    methods : any;
  }


  export class VisTrendView {
    private id_ : string;
    private categories_ : string[];
    private metrics_ : string[];
    private methods_ : string[];
    private years_ : number[];
    private title_ : string;

    constructor() {
      this.id_ = "";
      this.categories_ = [];
      this.metrics_ = [];
      this.methods_ = [];
      this.years_ = [];
      this.title_ = "";
    }

    id() : string;
    id(id : string) : VisTrendView;
    id(arg? : string) : any {
      if (arg === undefined) {
        return this.id_;
      }
      this.id_ = arg;
      return this;
    }

    categories() : string[];
    categories(metrics : string[]) : VisTrendView;
    categories(arg? : string[]) : any {
      if(arg === undefined) {
        return this.categories_;
      }
      this.categories_ = arg;
      return this;
    }

    metrics() : string[];
    metrics(metrics : string[]) : VisTrendView;
    metrics(arg? : string[]) : any {
      if (arg === undefined) {
        return this.metrics_;
      }
      this.metrics_ = arg;
      return this;
    }

    methods() : string[];
    methods(methods : string[]) : VisTrendView;
    methods(arg? : string[]) : any {
      if (arg === undefined) {
        return this.methods_;
      }
      this.methods_ = arg;
      return this;
    }

    years() : number[];
    years(years : number[]) : VisTrendView;
    years(arg? : number[]) : any {
      if (arg === undefined) {
        return this.years_;
      }
      this.years_ = arg;
      return this;
    }

    title() : string;
    title(title : string) : VisTrendView;
    title(arg? : string) : any {
      if (arg === undefined) {
        return this.title_;
      }
      this.title_ = arg;
      return this;
    }

    rootSelection() : D3.Selection {
      return d3.select("#" + this.id());
    }

    init(articles : Article[]) : VisTrendView {
      return this;
    }

    draw(articles : Article[]) : VisTrendView {
      return this;
    }
  }
}
