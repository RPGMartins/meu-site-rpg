function Clean(tagName)
{
  var elements =  document.getElementsByTagName(tagName)

  if(elements == undefined)
  {
    return;
  }

  for (let index = elements.length-1; index >= 0; index--) 
  {
    var element = elements[index];
    document.body.removeChild(element)
  }
}