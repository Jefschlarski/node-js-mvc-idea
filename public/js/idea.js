// Like Idea
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', function() {
            const ideaId = this.getAttribute('data-id');

            fetch(`/idea/like/${ideaId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log(data.ideaId);
                    const icon = this.querySelector('i');
                    const likeCount = document.querySelector(`#like-count-${data.ideaId}`);
                    if (data.liked) {
                        icon.classList.remove('bi-star');
                        icon.classList.add('bi-star-fill');
                    } else {
                        icon.classList.remove('bi-star-fill');
                        icon.classList.add('bi-star');
                    }
                    console.log(data.likes);
                    likeCount.textContent = data.likes;
                } else {
                    console.error('Erro ao curtir a ideia.');
                }
            })
            .catch(error => {
                console.error('Erro na requisição:', error);
            });
        });
    });
});
