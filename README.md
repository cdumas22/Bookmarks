Bookmarks
=========
To install the app run the powershell script install. 

This script will download any dependencies for node, (make sure to use walmart-wifi, not eagle)
Then it will start the node application in the background

It is nice to have the bookmarks app available whenever you are logged in without having to start it manually. To accomplish this set us a scheduled task in windows to run the Bookmarks.ps1 script.

You can find the app by going to the URL: http://localhost:3001

If you are using chrome you can install the chrome bookmarklet plugin. To do this open the folder with the project and go to Views/Chrome_Plugin/ and drag the file Bookmarks.safariextension.crx onto an open window in chrome. Chrome will ask you if you want to install the plugin. Click yes. Now you can use the bookmarklet to create bookmarks for whichever page you are currently viewing.
