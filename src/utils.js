export function getBrightness(bgColor) {
  var color = bgColor.substring(1, 7);
  var r = parseInt(color.substring(0, 2), 16); // hexToR
  var g = parseInt(color.substring(2, 4), 16); // hexToG
  var b = parseInt(color.substring(4, 6), 16); // hexToB
  return (((r * 0.299) + (g * 0.587) + (b * 0.114)) > 186) ?
    'dark' : 'bright';
}

export function findSuggestions(array, searchInput) {
  var searchSuggestions = { projects: [], users: [] }
  for (var i = 0; i < array.length; i++) {
    if (array[i].name) {
      if ((array[i].name).toLowerCase().includes(decodeURI(searchInput.slice(1)).toLowerCase())) searchSuggestions.projects.push(array[i]);
    } else {
      if ((array[i].username).toLowerCase().includes(decodeURI(searchInput.slice(1)).toLowerCase())) searchSuggestions.users.push(array[i]);
    }
  }
  return searchSuggestions;
}

export function getDate(publishedDate) {
  const date1 = new Date(publishedDate);
  const date2 = new Date();
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  return `${diffDays}d`;
}