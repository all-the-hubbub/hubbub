//
//  OAuth.swift
//  Hubbub
//
//  Created by Justin Rosenthal on 4/19/17.
//  Copyright © 2017 All The Hubbub. All rights reserved.
//

import p2_OAuth2
import Foundation

protocol OAuthClient {
    var accessToken:String? { get }
    
    func authorize(from context: AnyObject, callback: @escaping ((_ accessToken: String?, _ error: Error?) -> Void))
    func handleRedirectURL(_ redirect: URL)
}

class GitHubOAuthClient: OAuthClient {
    static let REDIRECT_URL = "https://hubbub-159904.firebaseapp.com/assets/oauth.html"
    
    internal var oauth2 = OAuth2CodeGrant(settings: [
        "client_id": "077cb2f4568e245a97eb",
        "client_secret": "aa4b736a317532b47202cb7c9820bba587e64a70",
        "authorize_uri": "https://github.com/login/oauth/authorize",
        "token_uri": "https://github.com/login/oauth/access_token",
        "scope": "public_repo,user:email",
        "redirect_uris": [GitHubOAuthClient.REDIRECT_URL],
        "secret_in_body": true,
        "verbose": true,
        "keychain": false,
        ] as OAuth2JSON)
    
    func authorize(from context: AnyObject, callback: @escaping ((_ accessToken: String?, _ error: Error?) -> Void)) {
        oauth2.authorizeEmbedded(from: context) { (authParams, error) in
            if (error != nil) {
                callback(nil, error)
                return
            }
            callback(self.oauth2.accessToken, nil)
        }
    }
    
    func handleRedirectURL(_ redirect: URL) {
        // The OAuth2 library has a strange requirement that the URL passed to handleRedirectURL() have the same base
        // as the URL specified in "redirect_uris" setting. In our case they're different, so we need to trick the library
        // by crafting a URL that will validate while making sure to pass through the query params.
        if let redirectURL = URL(string: GitHubOAuthClient.REDIRECT_URL + "?" + redirect.query!) {
            oauth2.handleRedirectURL(redirectURL)
        }
    }
    
    var accessToken: String? {
        return oauth2.accessToken
    }
}
