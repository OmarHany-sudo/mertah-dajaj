/* src/app.js */
import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// --- UI Logic ---

const header = document.getElementById('main-header');
const themeToggle = document.getElementById('theme-toggle');
const mobileToggle = document.getElementById('mobile-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const mobileClose = document.getElementById('mobile-close');

// Header scroll effect
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.firstElementChild.classList.remove('mt-4');
    header.firstElementChild.classList.add('mt-0', 'rounded-none');
  } else {
    header.firstElementChild.classList.add('mt-4');
    header.firstElementChild.classList.remove('mt-0', 'rounded-none');
  }
});

// Theme Toggle
themeToggle?.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
});

// Mobile Menu
const toggleMobile = (show) => {
  mobileMenu?.classList.toggle('hidden', !show);
  document.body.style.overflow = show ? 'hidden' : '';
};

mobileToggle?.addEventListener('click', () => toggleMobile(true));
mobileClose?.addEventListener('click', () => toggleMobile(false));
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => toggleMobile(false));
});

// Initialize Theme
if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
}

// --- Firebase Reviews Logic ---

const reviewsList = document.getElementById("reviewsList");
const reviewForm = document.getElementById("reviewForm");
const reviewsCollection = collection(db, "reviews");

export const initReviews = () => {
  if (!reviewsList) return;

  // Real-time listener for better UX
  const q = query(reviewsCollection, orderBy("timestamp", "desc"));
  
  onSnapshot(q, (snapshot) => {
    reviewsList.innerHTML = "";
    
    if (snapshot.empty) {
      reviewsList.innerHTML = "<p class='text-gray-500 text-center py-10'>لا توجد تقييمات بعد. كن أول من يشاركنا رأيه!</p>";
      return;
    }

    snapshot.forEach((doc) => {
      const r = doc.data();
      const stars = "⭐".repeat(r.rating);
      
      const reviewCard = document.createElement('div');
      reviewCard.className = "animate-fade-in-up bg-white dark:bg-brand-surface p-6 rounded-3xl shadow-sm border border-black/5 dark:border-white/5 mb-4 hover:shadow-md transition-shadow";
      reviewCard.innerHTML = `
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center gap-3">
            <div class="size-10 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold font-bold">
              ${r.name.charAt(0)}
            </div>
            <span class="font-bold text-lg">${r.name}</span>
          </div>
          <div class="flex text-sm">${stars}</div>
        </div>
        ${r.comment ? `<p class="text-gray-600 dark:text-gray-400 leading-relaxed">${r.comment}</p>` : ""}
      `;
      reviewsList.appendChild(reviewCard);
    });
  });
};

reviewForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const submitBtn = reviewForm.querySelector('button[type="submit"]');
  const name = document.getElementById("name").value.trim();
  const rating = document.getElementById("rating").value;
  const comment = document.getElementById("comment").value.trim();

  if (!name || !rating) return alert("من فضلك اكتب الاسم واختار تقييم ⭐");

  try {
    submitBtn.disabled = true;
    submitBtn.innerHTML = "جاري الإضافة...";
    
    await addDoc(reviewsCollection, {
      name,
      rating: parseInt(rating),
      comment: comment || "",
      timestamp: serverTimestamp(),
    });

    reviewForm.reset();
  } catch (error) {
    console.error("Error adding review:", error);
    alert("حصل خطأ أثناء إضافة التقييم 😢");
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = "أضف التقييم ✅";
  }
});

// Auto-init on page load
document.addEventListener('DOMContentLoaded', () => {
  initReviews();
});
