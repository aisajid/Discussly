const loadData = async (searchValue = 'his', isShowAll) => {
    toggleLoadingSpinner(true);
    const response = await fetch(`https://dummyjson.com/posts/search?q=${searchValue}`);
    const data = await response.json();
    const posts = data.posts;
    const filteredPosts = posts.filter(post =>
        post.tags.some(tag =>
            tag.toLowerCase().includes(searchValue)
        )
    );
    // console.log(filteredPosts);
    displayPost(filteredPosts, isShowAll);
}

const getUserName = async () => {
    const response = await fetch('https://randomuser.me/api/');
    const user = await response.json();
    const userName = user.results[0].name.first + " " + user.results[0].name.last;
    return userName;
}

const getComments = async (postId) => {
    const response = await fetch(`https://dummyjson.com/posts/${postId}/comments`);
    const data = await response.json();
    const comments = data.limit;
    return comments;
}

const isOnline = () => {
    let isOnline = false;
    if (((Math.random() * 10) + 5) > 10) {
        isOnline = true;
    }
    const indicator = document.getElementById('indicator');
    if (!isOnline) {
        return 'bg-indicator-red-color';
    }
    else {
        return 'bg-indicator-green-color';
    }
}




const displayPost = (posts, isShowAll) => {
    toggleLoadingSpinner(true);
    const postContainer = document.getElementById('card-container');
    postContainer.textContent = '';
    const showAllField = document.getElementById('isShowAll-Field');
    const h2 = document.createElement('h2');
    h2.innerText = 'no data found';
    h2.classList = `text-center text-2xl text-gray-500 font-bold hidden`;
    postContainer.appendChild(h2);
    if (posts.length === 0) {
        h2.classList.remove('hidden')
    }


    if (posts.length > 3 && !isShowAll) {
        showAllField.classList.remove('hidden');
    }
    else {
        showAllField.classList.add('hidden');
    }

    if (!isShowAll) {
        posts = posts.slice(0, 3);
    }
    // sob gulu post er jonno:
    posts.forEach(async post => {
        const postTime = Math.floor(Math.random() * 60) + 1;

        let userName = await getUserName();
        const postCard = document.createElement('div');
        postCard.classList = `p-6 md:p-10 bg-talk-card-bg-color rounded-3xl text-left flex gap-5 flex-col md:flex-row h-auto`;
        const comments = await getComments(post.id);

        const isOn = isOnline();

        postCard.innerHTML = ` 
        <!-- left part -->
        <div class="indicator">
            <img src="https://picsum.photos/seed/post-${post?.id}/400/250" alt="" class="w-20 h-20 rounded-xl">
            <span id="indicator" class="badge badge-xs indicator-item ${isOn}"></span>
        </div>

         <!-- right part -->
        <div>
            <!-- categories & author container-->
            <div class="flex gap-5 text-sm font-medium inter-normal text-black-text-color mb-3">
            <p id="category">#${post?.tags[0]}</p>
            <p>Author: <span>${userName}</span></p>
            </div>
        <h3 class="text-header-color font-bold text-xl mulish-normal mb-4">${post?.title}</h3>
            <p class="text-base inter-normal text-description-color mb-5 max-w-3xl">${post?.body}</p>
            <!-- icons container -->
                <div class="border-dashed border-t-2 border-talk-card-border-color pt-5 flex justify-between items-center">
                <!-- left part -->
                <div class="text-base inter-normal text-description-color flex gap-6">
                 <!-- massage -->
                <div class="flex items-center gap-2">
                    <img src="images/icons/massage-icon.png" alt="Comments" class=" w-4 md:w-5">
                    <p class="text-base">${comments}</p>
                </div>
                <!-- views  -->
                <div class="flex items-center gap-2">
                    <img src="images/icons/views-icon.png" alt="views" class=" w-4 md:w-5">
                    <p class="text-base">${post?.views}</p>
                </div>
                <!-- duration -->
                <div class="flex items-center gap-2">
                    <img src="images/icons/duration-icon.png" alt="duration" class=" w-4 md:w-5">
                    <p class="text-base">${postTime} min</p>
                </div>
                </div>
                <!-- right part -->
                <div >
                    <button onclick="MarkAsRead(${post?.id})" class="btn border-none rounded-full"><img src="images/icons/email.png" alt="Mark As Read"></button>
                </div>
                </div>
                </div>`;
        postContainer.appendChild(postCard);
    });

    toggleLoadingSpinner(false);
}

let readCount = 0;
const MarkAsRead = async (id) => {
    const markCountField = document.getElementById('mark-count-field');
    readCount++;
    markCountField.innerText = readCount;
    const response = await fetch(`https://dummyjson.com/posts/${id}`);
    const data = await response.json();
    showDetailsCard(data);
}

const showDetailsCard = (post) => {
    const cardContainer = document.getElementById('right-card-container');

    const card = document.createElement('div');
    card.classList = `text-base text-header-color font-semibold bg-white rounded-3xl flex justify-between p-2 md:p-4 m-0 text-left`;

    card.innerHTML = `
    <h4 class="max-w-56 min-w-0">${post?.title}</h4>
    <!-- views  -->
    <div class="flex items-center md:gap-2">
        <img src="images/icons/views-icon.png" alt="views">
        <p class="text-base">${post?.views}</p>
    </div>`;

    cardContainer.appendChild(card);

}
function toggleLoadingSpinner(isLoading) {
    const spinnerField = document.getElementById('loading-spinner-field');
    if (isLoading) {
        spinnerField.classList.remove('hidden');
    }
    else {
        spinnerField.classList.add('hidden');
    }
}

const handleSearch = (isShowAll) => {
    toggleLoadingSpinner(true);
    const searFiled = document.getElementById('search-input-field');
    const searValue = searFiled.value.toLowerCase().trim();
    loadData(searValue, isShowAll);
}

const handleShowAll = () => {
    handleSearch(true);
}

// enter handler
const searFiled = document.getElementById('search-input-field');
searFiled.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        handleSearch();
    }
})

const loadData2 = async () => {
    toggleSpinner2(true)
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();
    console.log(data);
    showDetailsLastedPost(data);
}

const getDate = (data) => {
    const date = new Date(data);

    const formattedDate = date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return formattedDate;
}

const getUser2 = async (id) => {

    const response = await fetch(`https://randomuser.me/api/`);
    const user = await response.json();
    return user;
}


const showDetailsLastedPost = async (posts) => {
    const cardContainer = document.getElementById('latedSectionCardField');

    posts = posts.slice(0, 3);
    posts.forEach(async post => {
        const user = await getUser2(post?.id);
        const newDate = getDate(user?.results[0]?.registered?.date?.slice(0, 10))
        const card = document.createElement('div');
        card.classList = `p-6 rounded-3xl border-2 border-latest-card-border-stroke gap-2 mulish-normal`;
        card.innerHTML = `
        <img src="https://picsum.photos/seed/post-${post?.id}/400/250" alt="" class="w-full h-64 mb-6 rounded-2xl">
        <div class="flex text-description-color text-base mb-3 gap-2">
        <img src="images/icons/data-icon.png" alt="Date" class="w-6">
        <p>${ newDate || "No Publish Date"}</p>
        </div>
        <h3 class="text-lg font-extrabold text-header-color mb-3">${post?.title}</h3>
                    <p class="text-description-color text-base mb-4">${post?.body}</p>

                    <div class="flex gap-4">
                        <img src="${user?.results[0]?.picture?.thumbnail}" alt="" class="w-11 h-11 rounded-full">
                        <div>
                            <h4 class="text-base font-bold text-header-color">${user?.results[0]?.name?.title + " " + user?.results[0]?.name?.first}</h4>
                            <p class="text-sm text-description-color">${user?.results[0]?.id?.name || 'unknown'}</p>
                        </div>
                    </div>
    `
        cardContainer.appendChild(card);
    })
    toggleSpinner2(false);

}

const toggleSpinner2 = (isToggle) => {
    const spinnerContainer = document.getElementById('loading-spinner-field2');
    if (isToggle) {
        spinnerContainer.classList.remove('hidden');
    }
    else {
        spinnerContainer.classList.add('hidden');

    }
}

loadData2();
loadData();