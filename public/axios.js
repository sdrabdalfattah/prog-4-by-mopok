

posts_container.innerHTML = ""
let currentPostId = null;


function showNotification(message, isSuccess = true) {
    let notification = document.createElement("div");
    notification.className = `al_mokbir ${isSuccess ? 'success' : 'error'}`;
    notification.innerHTML = `${message} <div class="close-btn"><svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z" fill="#ffffff" style=""></path>
  </svg></div>`;
    document.body.appendChild(notification);
    setTimeout(() => {
    notification.classList.add("show");
    }, 10);
    let close_notefecation_button = notification.querySelector(".close-btn")
    close_notefecation_button.addEventListener("click", function () {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 500);
    });
    setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 500);
    }, 4000);
    }
    








function timeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
    
    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(diffInSeconds / 3600);
    const days = Math.floor(diffInSeconds / 86400);
    const years = Math.floor(days / 365);

    if (minutes < 1) {
        return "Just now";
    } else if (minutes === 1) {
        return "1 minute ago";
    } else if (minutes < 60) {
        return `${minutes} minutes ago`;
    } else if (hours < 24) {
        return `${hours} hours ago`;
    } else if (days < 365) {
        return `${days} days ago`;
    } else {
        return `${years} year${years > 1 ? 's' : ''} ago`;
    }
}





function login_with_google() {
    window.location.href = "http://localhost:5000/auth/google";

}



function get_user_data() {
    axios.get("http://localhost:5000/api/me", {
        withCredentials: true 
      })
      .then(response => {

        
        
        const userData = response.data;
        header_img.src = response.data.avatar;

        let googleId =userData.googleId;
        localStorage.setItem("googleId", googleId);
         document.getElementById('login_with_google').style.display ='none'
         document.getElementById('logged_in_container').style.display ='flex'
      })
      .catch(err => {
        document.getElementById('login_with_google').style.display ='flex'
        document.getElementById('logged_in_container').style.display ='none'
      });
      
}


function get_posts(){
    axios.get('http://localhost:5000/posts')
      .then(function (response) {
        let posts = response.data;
        
        posts.forEach(post => {
            let posts_container = document.getElementById('posts_container');
            
            posts_container.innerHTML += `
                <div class="post_container">
                    <div class="post_header">
                        <img src="${post.user_photo}" alt="" onclick="get_user_Id('${post.googleId}')">
                        <span onclick="get_user_Id('${post.googleId}')">${post.user_name}</span>
                    </div>
                    <hr>
                    <div class="post_body">
                        <h1>${post.post_content}</h1>
                        <img onclick="showBox('${post.post_photo}')" id="post_img" src="${post.post_photo}" alt="">
                    </div>
                    <div class="post_footer">
                        
                        <button onclick="get_post_comments('${post._id}')"> 
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="35" height="35" fill="white" viewBox="0 0 24 24">
                                <path d="M 12 2 C 7.0414839 2 3 6.0414839 3 11 C 3 15.958516 7.0414839 20 12 20 L 12 23.091797 L 13.539062 22.105469 C 15.774897 20.671437 19.852053 17.575344 20.798828 12.882812 C 20.928446 12.277558 21 11.64776 21 11 C 21 6.0414839 16.958516 2 12 2 z M 12 4 C 15.877484 4 19 7.1225161 19 11 C 19 11.504182 18.94463 11.995387 18.841797 12.472656 L 18.839844 12.480469 L 18.837891 12.486328 C 18.24375 15.434377 15.971604 17.605199 14 19.138672 L 14 17.798828 L 12.875 17.939453 C 12.574056 17.977071 12.283936 18 12 18 C 8.1225161 18 5 14.877484 5 11 C 5 7.1225161 8.1225161 4 12 4 z"></path>
                            </svg>
                        comments (${post.commentCount})
                        </button>
                        <span>${timeAgo(post.createdAt)}</span>
                    </div>
                </div>
            `;
        });
      })
      .catch(function (error) {
        
      });
}

get_posts();






function get_post_comments(postId) {
    currentPostId = postId;
    document.body.style.overflow = "hidden";
    let popup_body = document.getElementById('comments_pop_up');
    popup_body.style.display = "flex";

    // الانتظار حتى يتم تطبيق العرض، ثم إزالة الكلاس hidden
    setTimeout(() => {
        popup_body.classList.remove("hidden");
    }, 10);



    axios.get(`http://localhost:5000/comments/${postId}`)
    .then(function (response) {


        document.getElementById('comment_body').innerHTML = ""
      

        let comments = response.data; 


        if (!comments || comments.length === 0) {
            let comment_body = document.getElementById('comment_body');
            comment_body.innerHTML = `<p style="padding:40px;color: grey;font-size: 20px;text-align: center;">No comments available for this post.</p>`;
            return; 
        }




        

        comments.forEach(comment => {
            let comment_body = document.getElementById('comment_body');
            comment_body.innerHTML += `
          
                    <div class="comment_header">
                        <img src="${comment.user_photo}" alt="user photo">
                        <span>${comment.user_name}</span>
                        <p>${timeAgo(comment.createdAt)}</p>
                    </div>
                    <span style="margin-left: 10px;">${comment.content}</span>
            
            `;
            
        });
    })
    .catch(function (error) {
     
    });
}


let comment_input = document.getElementById('comment_input')
comment_input.onkeyup = function () {

if (comment_input.value === "") {
    document.getElementById('add_comment_btn').classList.remove('not_clue');
} else {
    document.getElementById('add_comment_btn').classList.add('not_clue');
}

}


function add_comment() {
    const comment_input = document.getElementById('comment_input').value;
    let googleId =localStorage.getItem("googleId");

    axios.get("http://localhost:5000/api/me", {
        withCredentials: true 
      })
      .then()
      .catch(err => {
        showNotification("you have to login first", false);
      });

      axios.post("http://localhost:5000/create-comments",  {
        "content": comment_input,
        "googleId":googleId, 
        "postId": currentPostId

      }, {
        headers: {
            withCredentials: true , 
        }
    })
    .then(response => {
        get_post_comments(currentPostId);
        document.getElementById('comment_input').value = "";
        document.getElementById('add_comment_btn').classList.remove('not_clue');
        console.log( response);
    })
    .catch(error => {
        console.error("حدث خطأ أثناء رفع المنشور:", error);
    });
}


function add_post() {
    const post_text = document.getElementById('post_text').value;
    const post_img_input = document.getElementById('post_img_input').files[0];
    let googleId =localStorage.getItem("googleId");


    const formData = new FormData();
    formData.append("post_content", post_text);
    formData.append("post_photo", post_img_input);
    formData.append("googleId", googleId);


    axios.post("http://localhost:5000/create-post",  formData, {
        headers: {
            withCredentials: true, 
        }
    })
    .then(response => {
        hide_add_post_Box()
        showNotification("Post added successfully", true);
        get_posts()
        document.getElementById('post_text').value = "";
        document.getElementById('post_img_input').value = "";
        document.getElementById('post_img_preview').src = "";
        document.getElementById('char_count').innerText = "0 / 150";
    })
    .catch(error => {
        showNotification(error.response.data.error, false);
        
    });
}
get_user_data();



function logout() {
    // حذف googleId من localStorage
    localStorage.removeItem("googleId");
  
    // إرسال طلب للخادم لمسح الكوكي
    axios.post("http://localhost:5000/logout", {}, {
      withCredentials: true,
    })
    .then(res => {
      console.log(res.data.message);
      window.location.href = "/prog_4.html"; // أو أي صفحة تريد توجيه المستخدم لها بعد تسجيل الخروج
    })
    .catch(err => {
      console.error("فشل تسجيل الخروج:", err);
    });
  }
  
  
  function get_user_Id(userId) {
    location.href = `profile.html?userId=${userId}`;
  }

    
  function get_you_Id() {
    let googleId =localStorage.getItem("googleId");
    location.href = `profile.html?userId=${googleId}`;
  }
