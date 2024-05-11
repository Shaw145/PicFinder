const imageBox = document.querySelector(".images");
const loadmoreBtn = document.querySelector("#btn");
const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector(".searchBtn");
const lightBox = document.querySelector(".light-box");
const closeBtn = lightBox.querySelector(".fa-xmark");
const downloadBtn = lightBox.querySelector(".fa-download");

const pexelApiKey = "##################################";

const perPage = 20;
let currentPage = 1;
let searchTerm = null;



const downloadImg = (url)=>{
    fetch(url).then(res=>
        res.blob())
            .then(file=>{
                let aTag = document.createElement("a");

                aTag.href = URL.createObjectURL(file);

                aTag.download = new Date().getTime() //file name

                //clicking <a> tag so the file download
                aTag.click();

            })
            .catch(()=>
                alert("Failed to Download Image!!!")
            )
}

const showLightBox = (photographer, imgURL) =>{
    lightBox.querySelector("img").src = imgURL;
    lightBox.querySelector("span").textContent = photographer;
    downloadBtn.setAttribute("data-img", imgURL);
    lightBox.style.display = "block";
}


const generateHTML = (images) =>{
    imageBox.innerHTML += images.map(image =>
        `<li class="card">
            <img src="${image.src.large2x}" alt="" onclick="showLightBox('${image.photographer}', '${image.src.large2x}')">
            <div class="details">
                <div class="photographer">
                    <i class="fa-solid fa-camera"></i>
                    <span>${image.photographer}</span>
                </div>
                <button onclick="downloadImg('${image.src.large2x}'); event.stopPropagation();">
                    <i class="fa-solid fa-download" style="color: #000;"></i>
                </button>
            </div>
        </li>`
    ).join("");
}



async function getImages(apiURL){

    loadmoreBtn.textContent = "Loading...";
    loadmoreBtn.classList.add("disabled");

    await fetch(apiURL, {
        headers: {Authorization: pexelApiKey}
    }).then(res => res.json()).then(data => {
        generateHTML(data.photos);
        loadmoreBtn.textContent = "Load More";
        loadmoreBtn.classList.remove("disabled");
    }).catch(()=>
        alert("Failed to load images!!!")
    )

}

const loadmoreImages = () =>{
    currentPage++;
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiURL;
    getImages(apiURL);

}


const loadSearchImages = () =>{
    if(searchInput.value === "") return searchTerm = null;
    currentPage = 1;
    searchTerm = searchInput.value;
    imageBox.innerHTML = "";
    getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`)
}


getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);

loadmoreBtn.addEventListener("click", (e)=>{
    e.preventDefault()
    loadmoreImages();
});

searchBtn.addEventListener("click", loadSearchImages);

closeBtn.addEventListener("click", ()=>{
    lightBox.style.display = 'none';
})

downloadBtn.addEventListener("click", (e) => downloadImg(e.target.dataset.img));