$(document).ready(function() {  
    function changeHrefLink() {
      console.log("Changing href attribute...");
      // Select the <a> element with class "navbar-brand" and "navbar-home"
      var navbarBrand = document.getElementsByClassName('navbar-brand navbar-home')[0];
  
      // Check if the element exists
      if (navbarBrand) {
          console.log("Element found:", navbarBrand);
          // Update the href attribute with your desired link
          navbarBrand.setAttribute('href', '/app/goshala');
          console.log("Href attribute changed to:", navbarBrand.getAttribute('href'));
      } else {
          console.log("Element not found!");
      }
  }
  // Call the function to change href attribute
  changeHrefLink();
  
  });
  