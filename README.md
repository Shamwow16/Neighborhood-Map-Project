#Shamyle's Awesome Neighborhood Map Project#


##Reason for Use##

**Shamyle's Awesome Neighborhood Map Project** is part of the Udacity Front-End Web Development Nanodegree and is geared at helping students grasp the essentials of the Model-View-ViewModel architectural pattern. The Neighborhood Map application allows the user to view the main highlights in the happening neighborhood of Ravenswood in Chicago. Highlights include restaurants, nightlife, amenities, etc. Users can also view events happening in the area for the week.

##Overview##

The list of Shamyle's favorite locations is being read from a Firebase database object and is displayed on the page in the form of **Google Map markers** as well as a **List** that shows the name of each location. **Events** in the area can be viewed by opening the _Events Nearby_ dropdown menu. **Knockout.js** was used as the Javascript implementation of the Model-View-ViewModel pattern.

##List##
All of Shamyle's favorite locations are displayed in the form of a **List** on the page. In order to view the **List**, please click on the **Search Icon** in order to open up the sidebar. Users can also narrow down the list by inputting text into the textbox above the list. In order to view details of a particular location, click on the location name to open up an **infowindow** on the map which contains details provided by the **Yelp API**. 

##Marker##
Users can also view location details by clicking on a **marker** which also opens up the **infowindow** specific to that location. Each **marker** has a _bounce_ animation, which allows the user to see the selected **marker** more easily.

##Events##
Users can view events in the area by clicking on the dropdown menu labeled **Events Nearby**. The dropdown shows the most popular events in the area according to the **Eventful** API and more information for each event can be accessed by clicking on 'View Details' which will take the user to the **Eventful** page for that event.

##Note##
This application has been developed keeping usability and responsiveness in mind since it is the developer's aim to provide a smooth user experience. However, on very small devices, it is impossible to view all the events and location information at the same time. 




