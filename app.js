const fileInput = document.querySelector('.file-input');
const chooseImage = document.querySelector('.choose-img');
const saveImageBtn = document.querySelector('.save-img');
const previewImage = document.querySelector('.preview-img img');
const filterButtons = document.querySelectorAll('.filter button');
const rotateButtons = document.querySelectorAll('.rotate button');
const filterName = document.querySelector('.filter-info .name');
const filterValue = document.querySelector('.filter-info .value');
const filterSlider = document.querySelector('.slider input');
const resetBtn = document.querySelector('.reset-filter');

let brightness = 100, saturation = 100, inversion = 0, grayscale = 0;
let rotation = 0, flipHorizontal = 1, flipvertical = 1;

// ****** Event Listeners **********

fileInput.addEventListener("change", loadImage);

//  When we click on the choose Image btn, we want to click on the file input btn
chooseImage.addEventListener('click', () => {
  fileInput.click();
});

//  Update value of slider
filterSlider.addEventListener('input', updateFilter);

//  Filter Buttons
filterButtons.forEach((button) => {
  button.addEventListener('click', (e) => {
    filterButtons.forEach((btn) => {
      btn.classList.remove('active');
    });
    button.classList.add('active');
    filterName.textContent = button.innerHTML;

    if (button.id === "brightness")
    {
      filterSlider.max="200";
      filterSlider.value = brightness;
      filterValue.textContent = `${brightness}%`;
    }
    else if(button.id === "saturation")
    {
      filterSlider.max="200";
      filterSlider.value = saturation;
      filterValue.textContent = `${saturation}%`;
    }
    else if(button.id === "inversion")
    {
      filterSlider.max="100";
      filterSlider.value = inversion;
      filterValue.textContent = `${inversion}%`;
    }
    else if(button.id === "grayscale")
    {
      filterSlider.max="100";
      filterSlider.value = grayscale;
      filterValue.textContent = `${grayscale}%`;
    }
  });
});


resetBtn.addEventListener('click', resetFilters);

//  Rotate buttons
rotateButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (button.id == "left")
    {
      rotation -= 90;
    }
    else if (button.id == "right")
    {
      rotation += 90;
    }
    else if (button.id == "horizontal")
    {
      //  If flipHorizontal value is 1 set it to -1 else set it to 1
      flipHorizontal = flipHorizontal == 1 ? -1 : 1
    }
    else if (button.id == "vertical")
    {
      //  If flipVertical value is 1 set it to -1 else set it to 1
      flipvertical = flipvertical == 1 ? -1 : 1;
    }

    applyFilters();
  }); 
});

saveImageBtn.addEventListener('click', saveImage);





// ****** Functions **********
function loadImage()
{
  let file = fileInput.files[0];  //  Getting user selected file
  if(!file) return; //  If user hasn't selected a file return
  previewImage.src = URL.createObjectURL(file); //  URL.createObjectURL() creates a url of a passed file object
  previewImage.addEventListener('load', () => {
    resetFilters();   //  Resetting the filters once someone loads a new image
    document.querySelector('.container').classList.remove('disable');
  });
}

function updateFilter()
{
  const selectedFilter = document.querySelector('.filter .active');
  if (selectedFilter.id == "brightness")
  {
    brightness = filterSlider.value;
    filterValue.textContent = `${brightness}%`;
  }
  else if(selectedFilter.id == "saturation")
  {
    saturation = filterSlider.value;
    filterValue.textContent = `${saturation}%`;
  }
  else if(selectedFilter.id == "inversion")
  {
    inversion = filterSlider.value; 
    filterValue.textContent = `${inversion}%`;
  }
  else if(selectedFilter.id == "grayscale")
  {
    grayscale = filterSlider.value;
    filterValue.textContent = `${grayscale}%`;
  }
  
  applyFilters();
}

function applyFilters()
{
  previewImage.style.transform = `rotate(${rotation}deg) scale(${flipHorizontal}, ${flipvertical})`;
  previewImage.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}

function resetFilters()
{
  brightness = 100;
  saturation = 100;
  inversion = 0;
  grayscale = 0;
  rotation = 0; 
  flipHorizontal = 1;
  flipvertical = 1;

  filterButtons[0].click(); //  Clicking brightness btn so that brightness is selected by default

  applyFilters();
}

function saveImage()
{
  //  Create a canvas Element
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d") //  Return a drawing context on the canvas
  canvas.width = previewImage.naturalWidth;
  canvas.height = previewImage.naturalHeight;
  
  //  Applying user selected filters to canvas image
  ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
  ctx.translate(canvas.width / 2, canvas.height  / 2);  //  Translating canvas from center
  ctx.scale(flipHorizontal, flipvertical);
  if(rotation !== 0)
  {
    ctx.rotate(rotation * Math.PI / 180);
  }
  ctx.drawImage(previewImage, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

  //  Creating download
  const link = document.createElement("a"); //  Creating <a> element
  link.download = "Modified image.jpg";
  link.href = canvas.toDataURL(); //  toDataURL() returns a data URL containing a representation of the image
  link.click(); //  Then click on the link, to prompt the download
}