import { Injectable } from '@angular/core';

@Injectable()
export class MockAdalService {
    userInfo = { isAuthenticated: false };
    auth() {
        this.userInfo = { isAuthenticated: true };
    }
}
