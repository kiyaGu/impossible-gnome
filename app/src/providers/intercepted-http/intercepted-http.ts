import { Events } from 'ionic-angular';
import { Injectable } from '@angular/core';
import {
  ConnectionBackend,
  Headers,
  Http,
  Request,
  RequestOptionsArgs,
  Response,
  RequestOptions
} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../api-service/api-service';
import 'rxjs/add/operator/map';

declare const NProgress: any;

@Injectable()
export class InterceptedHttp extends Http {
  // Implementation based on https://www.illucit.com/blog/2016/03/angular2-http-authentication-interceptor/

  public _backend: any;

  constructor(backend: ConnectionBackend,
    defaultOptions: RequestOptions,
    private _events: Events) {
    super(backend, defaultOptions);
  }

  _loadingStart(url) {
    if (/\/api\//.test(url)) {
      try {
        NProgress.inc();
      } catch (err) {
        console.error(`Caught ${err}`);
      }
    }
  }

  _loadingDone(url) {
    if (/\/api\//.test(url)) {
      try {
        NProgress.done();
      } catch (err) {
        console.error(`Caught ${err}`);
      }
    }
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(null, super.request(url, options));
  }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    this._loadingStart(url);
    return this.intercept(url, super.get(url, this.getRequestOptionArgs(options)));
  }

  post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    this._loadingStart(url);
    return this.intercept(url, super.post(url, body, this.getRequestOptionArgs(options)));
  }

  put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    this._loadingStart(url);
    return this.intercept(url, super.put(url, body, this.getRequestOptionArgs(options)));
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    this._loadingStart(url);
    return this.intercept(url, super.delete(url, this.getRequestOptionArgs(options)));
  }

  getRequestOptionArgs(options?: RequestOptionsArgs): RequestOptionsArgs {
    if (!options) {
      options = new RequestOptions();
    }
    if (!options.headers) {
      options.headers = new Headers();
    }
    options.headers.append('Content-Type', 'application/json');
    options.headers.append('Access-Control-Allow-Credentials', 'true');
    return options;
  }

  intercept(url: string, observable: Observable<Response>): Observable<any> {
    let reqURL = url;
    return new Observable(obs => {
      observable.subscribe((response) => {
        reqURL = response.url;
        obs.next(response);
        this._loadingDone(url);
      }, (err) => {
        console.debug('err', err);
        reqURL = null;
        let errorResponse = {};
        try {
          errorResponse = JSON.parse(err._body);
        } catch (error) {
          console.debug('Error is not a JSON object', err);
        }
        this._loadingDone(url);
        if (err && err.status === 400) {
          obs.error(errorResponse);
        } else if (err && err.status === 401 && !this.isAuthEndpoint(err.url)) {
          console.log('unauthorised');
          this._events.publish('unauthorised');
          obs.error(err);
        } else if (err && err.status === 0) {
          this._events.publish('connection:noconnection');
          obs.error(err);
        } else {
          obs.error(err);
        }
      }, () => {
        this._loadingDone(url);
        // NOTE: mock this on unit tests
        if (window.hasOwnProperty('__karma__')) {
          return;
        }
        if (reqURL !== null && reqURL !== ApiService.getUrl('user/activity/count')) {
          setTimeout(() => {
            // activity stuff
            super.get(ApiService.getUrl('user/activity/count'), this.getRequestOptionArgs())
              .subscribe((response: Response) => {
                if (response.status === 200) {
                  let json = response.json();
                  this._events.publish('activity:count', json);
                }
              }, () => {
              });
          }, 99);
        }
      });
    });
  }

  private isAuthEndpoint(url) {
    return /\/auth\/login$/.test(url)
      || /\/user\/activity\/count$/.test(url)
      || /\/notification\/register$/.test(url);
  }

}
