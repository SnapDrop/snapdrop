(function(){
  
  // Select the button
  const btnTheme = document.getElementById('theme');
  // Check for dark mode preference at the OS level
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
   
  // Get the user's theme preference from local storage, if it's available
  const currentTheme = localStorage.getItem('theme');
  // If the user's preference in localStorage is dark...
  if (currentTheme == 'dark') {
    // ...let's toggle the .dark-theme class on the body
    document.body.classList.toggle('dark-theme');
  // Otherwise, if the user's preference in localStorage is light...
  } else if (currentTheme == 'light') {
    // ...let's toggle the .light-theme class on the body
    document.body.classList.toggle('light-theme');
  }
   
  // Listen for a click on the button 
  btnTheme.addEventListener('click', function() {
    // If the user's OS setting is dark and matches our .dark-theme class...
    if (prefersDarkScheme.matches) {
      // ...then toggle the light mode class
      document.body.classList.toggle('light-theme');
      // ...but use .dark-theme if the .light-theme class is already on the body,
      var theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    } else {
      // Otherwise, let's do the same thing, but for .dark-theme
      document.body.classList.toggle('dark-theme');
      var theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    }
    // Finally, let's save the current preference to localStorage to keep using it
    localStorage.setItem('theme', theme);
  });

})();