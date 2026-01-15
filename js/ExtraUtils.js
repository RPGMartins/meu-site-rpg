function CleanContainer(id) 
{
  const container = document.getElementById(id);
  if (container) 
  {
    container.innerHTML = "";
  }
}