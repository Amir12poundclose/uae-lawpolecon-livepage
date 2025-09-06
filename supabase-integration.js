/ 1. Include Supabase CDN in your HTML head (add this to your HTML):
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

// 2. Initialize Supabase
const SUPABASE_URL = 'https://ielfbzazagwbsbluziek.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllbGZiemF6YWd3YnNibHV6aWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzQwOTAsImV4cCI6MjA3MjY1MDA5MH0.vMvm31KJ0ilbFc4DtB7CZUtQ-Nmr3wyLM1C3eARVV6Y';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// EVENT FUNCTIONS
// ===============

// Add a new event
async function addEvent(eventData) {
    try {
        const { data, error } = await supabase
            .from('events')
            .insert([{
                title: eventData.title,
                description: eventData.description,
                event_date: eventData.event_date,
                location: eventData.location,
                image_url: eventData.image_url
            }]);

        if (error) throw error;
        console.log('Event added successfully:', data);
        return { success: true, data };
    } catch (error) {
        console.error('Error adding event:', error);
        return { success: false, error: error.message };
    }
}

// Get all events
async function getEvents() {
    try {
        const { data: events, error } = await supabase
            .from('events')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { success: true, data: events };
    } catch (error) {
        console.error('Error fetching events:', error);
        return { success: false, error: error.message };
    }
}

// Update an event
async function updateEvent(id, updates) {
    try {
        const { data, error } = await supabase
            .from('events')
            .update(updates)
            .eq('id', id);

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error updating event:', error);
        return { success: false, error: error.message };
    }
}

// Delete an event
async function deleteEvent(id) {
    try {
        const { data, error } = await supabase
            .from('events')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error deleting event:', error);
        return { success: false, error: error.message };
    }
}

// ARTICLE FUNCTIONS
// =================

// Add a new article
async function addArticle(articleData) {
    try {
        const { data, error } = await supabase
            .from('articles')
            .insert([{
                title: articleData.title,
                content: articleData.content,
                excerpt: articleData.excerpt,
                author: articleData.author,
                image_url: articleData.image_url,
                published: articleData.published || false
            }]);

        if (error) throw error;
        console.log('Article added successfully:', data);
        return { success: true, data };
    } catch (error) {
        console.error('Error adding article:', error);
        return { success: false, error: error.message };
    }
}

// Get all articles (or just published ones)
async function getArticles(publishedOnly = false) {
    try {
        let query = supabase
            .from('articles')
            .select('*')
            .order('created_at', { ascending: false });

        if (publishedOnly) {
            query = query.eq('published', true);
        }

        const { data: articles, error } = await query;

        if (error) throw error;
        return { success: true, data: articles };
    } catch (error) {
        console.error('Error fetching articles:', error);
        return { success: false, error: error.message };
    }
}

// Update an article
async function updateArticle(id, updates) {
    try {
        const { data, error } = await supabase
            .from('articles')
            .update(updates)
            .eq('id', id);

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error updating article:', error);
        return { success: false, error: error.message };
    }
}

// Delete an article
async function deleteArticle(id) {
    try {
        const { data, error } = await supabase
            .from('articles')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error deleting article:', error);
        return { success: false, error: error.message };
    }
}

// REAL-TIME SUBSCRIPTIONS
// ========================

// Listen for real-time changes to events
function subscribeToEvents(callback) {
    return supabase
        .channel('events_changes')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'events' },
            callback
        )
        .subscribe();
}

// Listen for real-time changes to articles
function subscribeToArticles(callback) {
    return supabase
        .channel('articles_changes')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'articles' },
            callback
        )
        .subscribe();
}

// USAGE EXAMPLES
// ==============

// Example: Add an event
/*
const eventResult = await addEvent({
    title: "Company Meeting",
    description: "Monthly team sync",
    event_date: "2024-01-15T10:00:00",
    location: "Conference Room A",
    image_url: "https://example.com/image.jpg"
});

if (eventResult.success) {
    console.log("Event added!");
} else {
    console.error("Failed:", eventResult.error);
}
*/

// Example: Get and display events
/*
const eventsResult = await getEvents();
if (eventsResult.success) {
    eventsResult.data.forEach(event => {
        console.log(`Event: ${event.title} - ${event.event_date}`);
    });
}
*/

// Example: Add an article
/*
const articleResult = await addArticle({
    title: "My First Article",
    content: "This is the full content of the article...",
    excerpt: "A brief summary of the article",
    author: "John Doe",
    published: true
});
*/

// Example: Set up real-time listening
/*
subscribeToEvents((payload) => {
    console.log('Event changed:', payload);
    // Refresh your events display here
});

subscribeToArticles((payload) => {
    console.log('Article changed:', payload);
    // Refresh your articles display here
});
*/

// FORM INTEGRATION HELPERS
// ========================

// Helper to handle form submissions for events
function handleEventForm(formElement) {
    formElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(formElement);
        const eventData = {
            title: formData.get('title'),
            description: formData.get('description'),
            event_date: formData.get('event_date'),
            location: formData.get('location'),
            image_url: formData.get('image_url')
        };

        const result = await addEvent(eventData);
        if (result.success) {
            formElement.reset();
            alert('Event added successfully!');
            // Refresh your events display
        } else {
            alert('Error: ' + result.error);
        }
    });
}

// Helper to handle form submissions for articles
function handleArticleForm(formElement) {
    formElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(formElement);
        const articleData = {
            title: formData.get('title'),
            content: formData.get('content'),
            excerpt: formData.get('excerpt'),
            author: formData.get('author'),
            image_url: formData.get('image_url'),
            published: formData.has('published')
        };

        const result = await addArticle(articleData);
        if (result.success) {
            formElement.reset();
            alert('Article added successfully!');
            // Refresh your articles display
        } else {
            alert('Error: ' + result.error);
        }
    });
}
