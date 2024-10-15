let rooms = [];
let deleteIndex = null;
let nextId = 1; 
let editIndex = null;

// Hàm lưu dữ liệu phòng lên local storage
function saveRoomsToLocalStorage() {
    localStorage.setItem('rooms', JSON.stringify(rooms));
}

// Hàm tải dữ liệu phòng từ local storage
function loadRoomsFromLocalStorage() {
    const storedRooms = localStorage.getItem('rooms');
    if (storedRooms) {
        rooms = JSON.parse(storedRooms);
    }
}

// Hàm render danh sách phòng ra bảng
function renderRooms() {
    const roomData = document.getElementById('room-data');
    roomData.innerHTML = ''; 

    if (rooms.length === 0) {
        roomData.innerHTML = '<tr><td class="no-data" colspan="9">Không có dữ liệu</td></tr>';
    } else {
        rooms.forEach((room, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${room.id}</td>
                <td>${room.name}</td>
                <td>${room.price}</td>
                <td>${room.bedType}</td>
                <td>${room.area}</td>
                <td>${room.view}</td>
                <td>${room.amenities}</td>
                <td><img src="${room.image}" alt="Ảnh phòng ${room.name}" width="50" height="50"></td>
                <td class="action-buttons">
                    <i class="fas fa-cog" onclick="editRoom(${index})"></i>
                    <i class="fas fa-trash" onclick="showDeleteModal(${index})"></i>
                    <i class="fas fa-check" onclick="toggleBooked(${index})"></i>
                </td>
            `;
            roomData.appendChild(row);
        });
    }
    renderBookedRooms();
}

// Hàm render danh sách phòng đã đặt
function renderBookedRooms() {
    const bookedRoomData = document.getElementById('booked-room-data');
    bookedRoomData.innerHTML = ''; 

    const bookedRooms = rooms.filter(room => room.isBooked);

    if (bookedRooms.length === 0) {
        bookedRoomData.innerHTML = '<tr><td class="no-data" colspan="9">Không có dữ liệu</td></tr>';
    } else {
        bookedRooms.forEach((room) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${room.id}</td>
                <td>${room.name}</td>
                <td>${room.price}</td>
                <td>${room.bedType}</td>
                <td>${room.area}</td>
                <td>${room.view}</td>
                <td>${room.amenities}</td>
                <td><img src="${room.image}" alt="Ảnh phòng ${room.name}" width="50" height="50"></td>
                <td class="action-buttons">
                    <i class="fas fa-cog" onclick="editRoom(${room.id - 1})"></i>
                    <i class="fas fa-trash" onclick="showDeleteModal(${room.id - 1})"></i>
                </td>
            `;
            bookedRoomData.appendChild(row);
        });
    }

    document.getElementById('total-booked-rooms').textContent = `Tổng số phòng đã đặt: ${bookedRooms.length}`;
}

// Hàm hiển thị form
function toggleForm() {
    const formContainer = document.getElementById('form-container');
    formContainer.style.display = (formContainer.style.display === 'none' || formContainer.style.display === '') ? 'block' : 'none';
}

// Hàm thêm hoặc chỉnh sửa phòng
function addRoom() {
    const name = document.getElementById('room-name').value;
    const price = document.getElementById('room-price').value;
    const bedType = document.getElementById('room-bed-type').value;
    const area = document.getElementById('room-area').value;
    const view = document.getElementById('room-view').value;
    const amenities = document.getElementById('room-amenities').value;
    const imageInput = document.getElementById('room-image');
    
    let image = rooms[editIndex]?.image || ''; 

    if (imageInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function (e) {
            image = e.target.result; 
            saveOrUpdateRoom(name, price, bedType, area, view, amenities, image);
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        saveOrUpdateRoom(name, price, bedType, area, view, amenities, image);
    }
}

// Lưu hoặc cập nhật thông tin phòng
function saveOrUpdateRoom(name, price, bedType, area, view, amenities, image) {
    if (editIndex !== null) {
        rooms[editIndex] = { ...rooms[editIndex], name, price, bedType, area, view, amenities, image };
        editIndex = null;
    } else {
        const newRoom = {
            id: nextId++,
            name,
            price,
            bedType,
            area,
            view,
            amenities,
            image,
            isBooked: false
        };
        rooms.push(newRoom);
    }
    renderRooms();
    toggleForm();
    saveRoomsToLocalStorage();
}

// Hàm hiển thị modal xác nhận xóa
function showDeleteModal(index) {
    deleteIndex = index;
    const modal = document.getElementById('delete-modal');
    modal.style.display = 'block';
}

// Hàm đóng modal
function closeModal() {
    const modal = document.getElementById('delete-modal');
    modal.style.display = 'none';
}

// Hàm xác nhận xóa
function confirmDelete() {
    if (deleteIndex !== null) {
        rooms.splice(deleteIndex, 1);
        renderRooms();
        closeModal();
        saveRoomsToLocalStorage();
    }
}

// Hàm chỉnh sửa phòng
function editRoom(index) {
    const room = rooms[index];
    document.getElementById('room-name').value = room.name;
    document.getElementById('room-price').value = room.price;
    document.getElementById('room-bed-type').value = room.bedType;
    document.getElementById('room-area').value = room.area;
    document.getElementById('room-view').value = room.view;
    document.getElementById('room-amenities').value = room.amenities;
    document.getElementById('room-image').value = ''; 

    editIndex = index;
    toggleForm();
}

// Hàm tìm kiếm phòng theo ID
function handleSearch(event) {
    if (event.key === 'Enter') {
        const searchValue = document.getElementById('search-input').value;
        const roomData = document.getElementById('room-data');
        roomData.innerHTML = '';

        const filteredRooms = rooms.filter(room => room.id.toString() === searchValue);

        if (filteredRooms.length === 0) {
            roomData.innerHTML = '<tr><td class="no-data" colspan="9">Không có dữ liệu</td></tr>';
        } else {
            filteredRooms.forEach((room) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${room.id}</td>
                    <td>${room.name}</td>
                    <td>${room.price}</td>
                    <td>${room.bedType}</td>
                    <td>${room.area}</td>
                    <td>${room.view}</td>
                    <td>${room.amenities}</td>
                    <td><img src="${room.image}" alt="Ảnh phòng ${room.name}" width="50" height="50"></td>
                    <td class="action-buttons">
                        <i class="fas fa-cog" onclick="editRoom(${room.id - 1})"></i>
                        <i class="fas fa-trash" onclick="showDeleteModal(${room.id - 1})"></i>
                        <i class="fas fa-check" onclick="toggleBooked(${room.id - 1})"></i>
                    </td>
                `;
                roomData.appendChild(row);
            });
        }
    }
}

// Hàm hiển thị tab
function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-button');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`button[onclick="showTab('${tabId}')"]`).classList.add('active');
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tabContent => {
        tabContent.style.display = 'none';
    });
    document.getElementById(tabId).style.display = 'block';
}

// Tải dữ liệu và render danh sách phòng khi tải lại trang
document.addEventListener('DOMContentLoaded', () => {
    loadRoomsFromLocalStorage();
    renderRooms();
});
