//
//  Slot.swift
//  Hubbub
//
//  Created by Justin Rosenthal on 4/25/17.
//  Copyright © 2017 All The Hubbub. All rights reserved.
//

import Firebase
import Foundation

class Slot: NSObject {
    
    var id:String
    var name:String?
    var location:String?
    var startAt:Int?
    var endAt:Int?
    
    var startDate:Date? {
        get {
            if self.startAt == nil {
                return nil
            }
            return Date(timeIntervalSince1970: TimeInterval(self.startAt!))
        }
    }
    
    init?(key:String, data:[String:Any]) {
        self.id = key
        self.name = data["name"] as? String
        self.location = data["location"] as? String
        self.startAt = data["startAt"] as? Int
        self.endAt = data["endAt"] as? Int
    }
    
    convenience init?(snapshot:FIRDataSnapshot) {
        guard let data = snapshot.value as? [String:Any] else { return nil }
        self.init(key: snapshot.key, data: data)
    }
}
