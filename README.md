Concierge
=========
<img src='https://travis-ci.org/ecjs/Concierge.svg?branch=master'/><br>
<img src='https://david-dm.org/ecjs/Concierge.png'/><br>
Mobile wake up call service with a real person.
- User signs up with email/name/password, enters their phone number.  
- We verify their number via sms.  
- They type in their wake up call time, proceeded by what information they would like to receive. (Weather, stock quotes, news (this is current unavailable))
- At the exact time of their wakeup call, Twilio will make a call to an available concierge (or if unavailable robo call the user). 
- Once a concierge picks up, we will connect them with the user for their wakeup call.
- Once a user signs up, they can also choose to become a Concierge.  
- They then identify when they are available.
- Todo:
- Admin
- Fix job overlap issues for the Concierge
- More functionality/verification for Concierges.
- Frontend/angular app.

