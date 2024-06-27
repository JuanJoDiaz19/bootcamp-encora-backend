import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: process.env.CLIENT_ID_GOOGLE_OAUTH2,
            clientSecret: process.env.CLIENT_SECRET_GOOGLE_OAUTH2 ,
            callbackURL: process.env.URL_APP + 'auth/google/redirect',
            scope: ['profile', 'email']
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<any> {
        
        const {name, emails, photos} = profile;
        const user = {
            email:emails[0].value,
            first_name: name.givenName,
            last_name:name.familyName, 
            password: name.givenName + "Aa1*",
            role: "CLIENT",
            birth_date:  new Date('2024-06-27')

        } 
        done(null, user);
            
    }
}