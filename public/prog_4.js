
let popup_body = document.getElementById('comments_pop_up');
let add_post_container = document.getElementById('add_post_container');

const img_review = document.getElementById("img_review");
setTimeout(() => {
  add_post_container.classList.add("hidden");
  img_review.classList.add("hidden");
  popup_body.classList.add("hidden");

}, 300);






function showBox(post_photo) {

  document.body.style.overflow = "hidden";

  const img_review = document.getElementById("img_review");
  const review_img = img_review.querySelector('img'); 


  if (review_img) {
    review_img.src = post_photo;  
  }


  img_review.style.display = "flex";


  setTimeout(() => {

    img_review.classList.remove("hidden");
  }, 10);
}



  
  function hideBox() {
    document.body.style.overflow = "auto";
    const img_review = document.getElementById("img_review");
    img_review.classList.add("hidden");
    setTimeout(() => {
        img_review.style.display = "none";
    }, 300); 
  }





   function hide_comments_Box() {
    setTimeout(() => { document.getElementById('comment_body').innerHTML = "" }, 300);
    document.body.style.overflow = "auto";
    let popup_body= document.getElementById('comments_pop_up')
    popup_body.classList.add("hidden");
    setTimeout(() => {
        popup_body.style.display = "none";
    }, 300); 
  }



  


  function show_add_post_Box() {
    add_post_container.style.display = "flex"; 
    setTimeout(() => {
      add_post_container.classList.remove("hidden");
    }, 10); // تأخير بسيط جدًا يكفي
  }
  
  function hide_add_post_Box() {
    add_post_container.classList.add("hidden");
    setTimeout(() => {
      add_post_container.style.display = "none"; 
    }, 300); 
  }
  



    const menuButton = document.getElementById("menuButton");
    const contextMenu = document.getElementById("contextMenu");

    // وظيفة لعرض قائمة السياق
    function show_contextMenu(event) {
        event.stopPropagation();  // منع النقر من إغلاق القائمة مباشرة
        contextMenu.style.display = "block";  // إظهار القائمة

        // تحديد موقع القائمة بناءً على موقع الزر
        const rect = menuButton.getBoundingClientRect();
        contextMenu.style.left = rect.left + "px";
        contextMenu.style.top = rect.bottom + "px";
    }

    // إضافة الحدث عند النقر على العنصر
    menuButton.addEventListener("click", show_contextMenu);

    // إخفاء قائمة السياق عند النقر في أي مكان آخر في الصفحة
    document.addEventListener("click", function () {
        contextMenu.style.display = "none";
    });

    
    function triggerUpload() {
      document.getElementById("post_img_input").click();
    }
    
    function previewImage(event) {
      const input = event.target;
      const preview = document.getElementById("post_img_preview");
    
      if (input.files && input.files[0]) {
        const reader = new FileReader();
    
        reader.onload = function(e) {
          preview.src = e.target.result;
        };
    
        reader.readAsDataURL(input.files[0]);
      }
    }
    
  


    function autoResize(textarea) {
      const maxChars = 150;
      const charCount = textarea.value.length;
      if (charCount > maxChars) {
          textarea.value = textarea.value.slice(0, maxChars);
      
      }

      document.getElementById("char_count").textContent = `${textarea.value.length} / ${maxChars}`;
      
      textarea.style.height = 'auto'; 
      textarea.style.height = textarea.scrollHeight + 'px';
    }
    


function auto_stop(input) {
  const maxChars = 60;
  const minchart = 40;
  const charCount = input.value.length;
if (input.value.length > minchart) {
  document.getElementById('char_count_comment').style.opacity ='1'
}else {document.getElementById('char_count_comment').style.opacity ='0'}  
  if (charCount > maxChars) {
    input.value = input.value.slice(0, maxChars);
  }
  document.getElementById("char_count_comment").textContent = `${input.value.length} / ${maxChars}`;
}

