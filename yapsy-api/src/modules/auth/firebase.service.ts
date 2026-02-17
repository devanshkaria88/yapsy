import { Injectable, Logger, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

export interface FirebaseUser {
  uid: string;
  email: string;
  name?: string;
  picture?: string;
  provider: string; // 'google.com' | 'apple.com' | 'password'
}

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    if (admin.apps.length === 0) {
      const projectId = this.configService.get<string>('firebase.projectId');
      const privateKey = this.configService.get<string>('firebase.privateKey');
      const clientEmail = this.configService.get<string>('firebase.clientEmail');

      if (projectId && clientEmail && privateKey) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            privateKey: privateKey.replace(/\\n/g, '\n'),
            clientEmail,
          }),
        });
        this.logger.log('Firebase Admin SDK initialized');
      } else {
        // In development, init without credentials (will fail on verifyIdToken)
        this.logger.warn(
          'Firebase credentials not fully configured — token verification will fail',
        );
        admin.initializeApp({ projectId: projectId || 'yapsy-dev' });
      }
    }
  }

  /**
   * Verify a Firebase ID token and extract user info.
   * Throws UnauthorizedException if the token is invalid or expired.
   */
  async verifyIdToken(idToken: string): Promise<FirebaseUser> {
    try {
      const decoded = await admin.auth().verifyIdToken(idToken);

      // Determine the sign-in provider
      const provider =
        decoded.firebase?.sign_in_provider ?? 'unknown';

      return {
        uid: decoded.uid,
        email: decoded.email ?? '',
        name: decoded.name as string | undefined,
        picture: decoded.picture as string | undefined,
        provider,
      };
    } catch (error) {
      this.logger.warn(`Firebase token verification failed: ${(error as Error).message}`);
      throw new UnauthorizedException('Invalid or expired Firebase token');
    }
  }
}
