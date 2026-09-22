const fs = require('fs');
const cheerio = require('cheerio');
const dbPath = 'c:/Users/akkik/Coverwise/data/pages.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const reviews = [
    {
        name: "Kalyani",
        image: "/wp-content/uploads/2025/04/kalyani.png",
        quote: "I was referred to Gaurav by a friend and my experience with Gaurav was very good. Super prompt in responses and helped me with understanding my current health insurance policy."
    },
    {
        name: "Mahesh Pal",
        image: "/wp-content/uploads/2025/04/mahesh.png",
        quote: "Very good service with accurate information. Great job done by Gaurav Aggarwal and team. Price assessment: Reasonable price. Claims process: Quick and easy."
    },
    {
        name: "saurav sankrit",
        image: "/wp-content/uploads/2025/04/saurav.png",
        quote: "I had a great experience working with Gauravji and his team. They were extremely knowledgeable, patient, and took the time to clearly explain all my options."
    }
];

let count = 0;

for (let key in db.pages) {
    let html = db.pages[key].html;
    if (html.includes('testimonial-three__single')) {
        const $ = cheerio.load(html, { decodeEntities: false }, false);
        
        const testimonials = $('.testimonial-three__single');
        if (testimonials.length === 3) {
            testimonials.each((i, el) => {
                const review = reviews[i];
                $(el).find('.testimonial-three__image img').attr('src', review.image).attr('alt', review.name);
                $(el).find('.testimonial-three__name').text(review.name);
                
                // Set the quote text, keeping the span.arrow inside
                const quoteDiv = $(el).find('.testimonial-three__quote');
                quoteDiv.text(review.quote + '\n               ');
                quoteDiv.append('<span class="arrow"></span>\n            ');
            });
            
            const newHtml = $.html();
            if (html !== newHtml) {
                db.pages[key].html = newHtml;
                count++;
            }
        }
    }
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log(`Updated ${count} pages`);
