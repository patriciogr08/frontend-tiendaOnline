import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

const ACCESS_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  private ready: Promise<void>;
  constructor(private storage: Storage) { this.ready = this.storage.create().then(() => {}); }
  private async ensure(){ await this.ready; }

  async setTokens(access: string, refresh?: string) {
    await this.ensure();
    await this.storage.set(ACCESS_KEY, access);
    if (refresh) await this.storage.set(REFRESH_KEY, refresh);
  }
  async getAccess(){ await this.ensure(); return this.storage.get(ACCESS_KEY); }
  async getRefresh(){ await this.ensure(); return this.storage.get(REFRESH_KEY); }
  async clear(){
    await this.ensure();
    await this.storage.remove(ACCESS_KEY);
    await this.storage.remove(REFRESH_KEY);
  }
}
