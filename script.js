document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('map_grid'); // เริ่มต้นด้วยการเข้าถึงอีลิเมนต์ HTML ที่มี id เป็น 'map_grid'

    // สร้างตาราง 25x25
    for (let i = 0; i < 625; i++) { // 25x25 = 625 เซลล์
        const tile = document.createElement('div'); // สร้าง Element div ใหม่สำหรับแต่ละช่อง
        tile.classList.add('tile'); // เพิ่มคลาส tile ให้กับ div ที่สร้างขึ้น
        grid.appendChild(tile); // เพิ่ม div นี้เข้าไปใน grid
    }

    // กำหนดตำแหน่งของกำแพงใน grid [array]
    const walls = [12, 13, 15, 16, 22, 26, 52, 56, 62, 63, 65, 66];

    // เพิ่มกำแพงใน grid
    for (const wall of walls) { // วนลูปผ่านตำแหน่งกำแพงแต่ละตำแหน่ง
        grid.children[wall].classList.add('wall'); // เพิ่มคลาส wall ให้กับช่องที่เป็นกำแพง
    }

    // ตำแหน่งอาวุธ
    const weapons = [20, 33, 60];
    for (const weapon of weapons) {
        grid.children[weapon].classList.add('weapon');
    }

    let weaponCount = 0;
    const weaponClasses = ['player-weapon-purple', 'player-weapon-orange', 'player-weapon-cyan'];

    function collectWeapon(position) {
        if (grid.children[position].classList.contains('weapon')) {
            // ลบ class 'weapon' ออกจากช่องที่ผู้เล่นเหยียบ
            grid.children[position].classList.remove('weapon');
            grid.children[position].style.backgroundColor = 'white';

            // เพิ่ม class อาวุธให้กับตัวละคร
            const currentWeaponClass = weaponClasses[weaponCount % weaponClasses.length];
            grid.children[playerPosition].classList.remove('player-weapon-purple', 'player-weapon-orange', 'player-weapon-cyan');
            grid.children[playerPosition].classList.add(currentWeaponClass);

            // เพิ่มจำนวนอาวุธที่เก็บได้
            weaponCount++;

            // แสดงผลในคอนโซล
            console.log(`Collected weapon! Total: ${weaponCount}`);
        }
    }

    function updateStatus() {
        console.log(`Player position: ${playerPosition}`);
        console.log(`Weapons collected: ${weaponCount}`);
        console.log(`Weapons left: ${document.querySelectorAll('.weapon').length}`);
    }

    /* ตำแหน่ง player */
    let playerPosition = 44; // กำหนดตำแหน่งเริ่มต้นของ player ที่ช่องที่ 44
    const playerTile = grid.children[playerPosition]; // เข้าถึง playerPosition ใน div 625 ช่อง และจะเก็บการอ้างอิงไปที่ช่องที่ 44 ใน grid
    playerTile.classList.add('player'); // เพิ่มคลาส player ให้กับมันและแสดงมัน

    /* ติดตามการกดปุ่ม */
    const keys = {}; // ตัวแปรเก็บสถานะของคีย์ที่ถูกกด

    document.addEventListener('keydown', (e) => { // เพิ่ม event listener สำหรับเหตุการณ์การกดปุ่ม
        keys[e.code] = true; // บันทึกว่าปุ่มถูกกด (true) ในออบเจ็กต์ keys
        console.log(`Key down: ${e.code}`); // แสดงรหัสปุ่มที่ถูกกดในคอนโซล

        let newPosition = playerPosition; // กำหนดตำแหน่งใหม่เริ่มต้นเท่ากับตำแหน่งปัจจุบัน
        const row = Math.floor(playerPosition / 25); // คำนวณแถวปัจจุบัน
        const col = playerPosition % 25; // คำนวณคอลัมน์ปัจจุบัน

        // ตรวจสอบการกดปุ่มและคำนวณตำแหน่งใหม่ตามทิศทางการเคลื่อนที่
        if (keys['KeyW'] || keys['ArrowUp']) { // ขึ้น
            if (row > 0) newPosition -= 25;
            playerTile.style.backgroundImage = "gif/Sprite-0002.gif"; // เปลี่ยนเป็น GIF ขึ้น
        } else if (keys['KeyS'] || keys['ArrowDown']) { // ลง
            if (row < 24) newPosition += 25;
            playerTile.style.backgroundImage = ""; // เปลี่ยนเป็น GIF ลง
        } else if (keys['KeyA'] || keys['ArrowLeft']) { // ซ้าย
            if (col > 0) newPosition -= 1;
            playerTile.style.backgroundImage = "gif/Sprite-0002.gif"; // เปลี่ยนเป็น GIF ซ้าย
        } else if (keys['KeyD'] || keys['ArrowRight']) { // ขวา
            if (col < 24) newPosition += 1;
            playerTile.style.backgroundImage = "gif/Sprite-0002.gif"; // เปลี่ยนเป็น GIF ขวา
        }

        if (newPosition >= 0 && newPosition < 625 && !grid.children[newPosition].classList.contains('wall')) {
            // ตรวจสอบตำแหน่งใหม่ว่าอยู่ในแผนที่และไม่ชนกำแพง
            grid.children[playerPosition].classList.remove('player'); // ลบ player ในตำแหน่งเก่า
            playerPosition = newPosition; // อัพเดตตำแหน่ง
            playerTile = grid.children[playerPosition];
            playerTile.classList.add('player'); // เพิ่ม player ไปยังตำแหน่งใหม่
            collectWeapon(playerPosition);
            updateStatus();
        }

        console.log(`Row: ${row}, Col: ${col}`);
        console.log(`New Position: ${newPosition}`);
        console.log(`Is Wall: ${grid.children[newPosition].classList.contains('wall')}`);
    });

    document.addEventListener('keyup', (e) => { // เพิ่ม event listener สำหรับเหตุการณ์ปล่อยปุ่ม
        keys[e.code] = false; // บันทึกว่าปุ่มถูกปล่อย (false) ในออบเจ็กต์ keys
        console.log(`Key up: ${e.code}`); // แสดงรหัสปุ่มที่ถูกปล่อยในคอนโซล
    });
});
