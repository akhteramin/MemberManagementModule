# Member Management Module
The Member Service is developed for the member service/admin team. Their responsibilities are confined within the member management scope, thus this application is developed with only member management functionalities. The big focus of this application is to find the verifiable members easily and help the team to take necessary actions (verify them or help them to get verified). 
## Features

1. Member Search and Information Get
Get member list with different filtering along with different sort criteria.
Separate APIs to get member’s basic details, identification documents, bank accounts, card information, introducer list, introduced list, invitees and invited list, suspension history, balance, profile-completion score, contacts, likely names, and consent documents.
Member’s activity list get with different search parameters
Member’s transaction list get with different search parameters
Check if a member is verifiable and list the missing fields
Details verification history of an identification document
For business member: business offer list get, offer templates get APIs

2. Members’ Information Update (Through MM-Admin)
Separate APIs to update member’s basic details, address, identification documents, profile picture, business owner picture, account status, and account class
Upload a consent document of a member
For business member: add a business offer to a member, update and delete offers

3. Member Verification
Identification document verify/un-verify through mm-admin, additionally, store history and comments
Verify or reject a member’s card through mm-admin
Verify or reject a member, update member’s verification status through mm-admin, store history and admins’ comments
Approve or reject a member after initial verification, update member’s verification status through mm-admin. Store history and admins’ comments
Revoke verification (un-verify a verified member), update member’s verification status to mm-admin. Store history and comments

4. Admin user management (role permission is managed from auth module)

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
