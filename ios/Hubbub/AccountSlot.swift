//
//  AccountSlot.swift
//  Hubbub
//
//  Created by Justin Rosenthal on 4/25/17.
//  Copyright © 2017 All The Hubbub. All rights reserved.
//

import Firebase
import Foundation

class AccountSlot: NSObject {
    var date:String
    var time:String
    var topicID:String?
    
    init(date:String, time:String, topicID:String?) {
        self.date = date
        self.time = time
        self.topicID = topicID
    }
    
    init?(key:String, data:[String:Any]) {
        guard let time = (data["time"] as? String) else { return nil }
        
        self.date = key
        self.time = time
        self.topicID = data["topicId"] as? String
    }
    
    convenience init?(snapshot:FIRDataSnapshot) {
        guard let data = snapshot.value as? [String:Any] else { return nil }
        self.init(key: snapshot.key, data: data)
    }
    
    convenience override init() {
        self.init(date: "", time: "", topicID: nil)
    }
}
