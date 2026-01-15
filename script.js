// Main application for Self-Reconfiguring Modular Robots simulation
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
    
    // Module class definition
    class Module {
        constructor(id, x, y) {
            this.id = id;
            this.x = x;
            this.y = y;
            this.color = this.getModuleColor(id);
            this.targetX = x;
            this.targetY = y;
            this.isMoving = false;
        }
        
        getModuleColor(id) {
            const colors = [
                '#2563eb', '#10b981', '#8b5cf6', 
                '#f59e0b', '#ef4444', '#0ea5e9',
                '#84cc16', '#f97316', '#a855f7'
            ];
            return colors[id % colors.length];
        }
        
        moveTo(targetX, targetY) {
            this.targetX = targetX;
            this.targetY = targetY;
            this.isMoving = true;
        }
        
        updatePosition() {
            if (!this.isMoving) return false;
            
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 0.1) {
                this.x = this.targetX;
                this.y = this.targetY;
                this.isMoving = false;
                return false;
            }
            
            // Move a fraction of the distance
            this.x += dx * 0.3;
            this.y += dy * 0.3;
            
            return true;
        }
    }
    
    // ModularRobot class definition
    class ModularRobot {
        constructor(numModules = 9) {
            this.modules = [];
            this.numModules = numModules;
            this.gridSize = 6; // 6x6 grid for demo
            this.initializeModules();
        }
        
        initializeModules() {
            // Start with a random configuration
            const positions = [];
            for (let i = 0; i < this.numModules; i++) {
                let x, y;
                do {
                    x = Math.floor(Math.random() * this.gridSize);
                    y = Math.floor(Math.random() * this.gridSize);
                } while (positions.some(pos => pos.x === x && pos.y === y));
                
                positions.push({x, y});
                this.modules.push(new Module(i, x, y));
            }
        }
        
        getTargetPositions(shape) {
            const positions = [];
            const gridSize = this.gridSize;
            
            switch(shape) {
                case 'line':
                    // Horizontal line in the middle
                    for (let i = 0; i < this.numModules; i++) {
                        const x = i % gridSize;
                        const y = Math.floor(gridSize / 2);
                        positions.push({x, y});
                    }
                    break;
                    
                case 'square':
                    // Form a square shape
                    const side = Math.ceil(Math.sqrt(this.numModules));
                    for (let i = 0; i < this.numModules; i++) {
                        const x = i % side;
                        const y = Math.floor(i / side);
                        positions.push({x, y});
                    }
                    break;
                    
                case 'rectangle':
                    // Form a rectangle (2 rows)
                    const cols = Math.ceil(this.numModules / 2);
                    for (let i = 0; i < this.numModules; i++) {
                        const x = i % cols;
                        const y = Math.floor(i / cols);
                        positions.push({x, y});
                    }
                    break;
                    
                default:
                    // Random positions
                    for (let i = 0; i < this.numModules; i++) {
                        positions.push({
                            x: Math.floor(Math.random() * gridSize),
                            y: Math.floor(Math.random() * gridSize)
                        });
                    }
            }
            
            return positions;
        }
        
        reconfigure(shape) {
            const targetPositions = this.getTargetPositions(shape);
            
            // Assign each module to a target position
            for (let i = 0; i < this.modules.length; i++) {
                const module = this.modules[i];
                const target = targetPositions[i % targetPositions.length];
                module.moveTo(target.x, target.y);
            }
            
            return true;
        }
        
        reset() {
            // Reset to initial random positions
            const positions = [];
            for (let i = 0; i < this.numModules; i++) {
                let x, y;
                do {
                    x = Math.floor(Math.random() * this.gridSize);
                    y = Math.floor(Math.random() * this.gridSize);
                } while (positions.some(pos => pos.x === x && pos.y === y));
                
                positions.push({x, y});
                this.modules[i].moveTo(x, y);
            }
        }
        
        update() {
            let anyMoving = false;
            this.modules.forEach(module => {
                if (module.updatePosition()) {
                    anyMoving = true;
                }
            });
            return anyMoving;
        }
    }
    
    // Demo Visualization
    class DemoVisualization {
        constructor() {
            this.robot = new ModularRobot(9);
            this.demoGrid = document.getElementById('demoGrid');
            this.heroGrid = document.getElementById('heroGrid');
            this.statusIndicator = document.getElementById('statusIndicator');
            this.moduleTags = document.getElementById('moduleTags');
            this.isAnimating = false;
            
            this.initializeGrids();
            this.setupEventListeners();
            this.renderModuleTags();
            this.startAnimationLoop();
        }
        
        initializeGrids() {
            // Clear grids
            this.demoGrid.innerHTML = '';
            this.heroGrid.innerHTML = '';
            
            // Create demo grid cells
            for (let row = 0; row < 6; row++) {
                for (let col = 0; col < 6; col++) {
                    const cell = document.createElement('div');
                    cell.className = 'demo-cell';
                    cell.dataset.x = col;
                    cell.dataset.y = row;
                    this.demoGrid.appendChild(cell);
                }
            }
            
            // Create hero grid cells (5x5 for hero section)
            for (let row = 0; row < 5; row++) {
                for (let col = 0; col < 5; col++) {
                    const cell = document.createElement('div');
                    cell.className = 'grid-cell';
                    this.heroGrid.appendChild(cell);
                }
            }
            
            this.updateGrids();
        }
        
        setupEventListeners() {
            // Demo buttons
            document.getElementById('btnLine').addEventListener('click', () => {
                if (!this.isAnimating) {
                    this.robot.reconfigure('line');
                    this.isAnimating = true;
                    this.statusIndicator.style.backgroundColor = '#f59e0b';
                }
            });
            
            document.getElementById('btnSquare').addEventListener('click', () => {
                if (!this.isAnimating) {
                    this.robot.reconfigure('square');
                    this.isAnimating = true;
                    this.statusIndicator.style.backgroundColor = '#f59e0b';
                }
            });
            
            document.getElementById('btnRectangle').addEventListener('click', () => {
                if (!this.isAnimating) {
                    this.robot.reconfigure('rectangle');
                    this.isAnimating = true;
                    this.statusIndicator.style.backgroundColor = '#f59e0b';
                }
            });
            
            document.getElementById('btnReset').addEventListener('click', () => {
                if (!this.isAnimating) {
                    this.robot.reset();
                    this.isAnimating = true;
                    this.statusIndicator.style.backgroundColor = '#f59e0b';
                }
            });
        }
        
        renderModuleTags() {
            this.moduleTags.innerHTML = '';
            this.robot.modules.forEach(module => {
                const tag = document.createElement('div');
                tag.className = 'module-tag';
                tag.textContent = module.id;
                tag.style.backgroundColor = module.color;
                this.moduleTags.appendChild(tag);
            });
        }
        
        updateGrids() {
            // Clear all cells
            document.querySelectorAll('.demo-cell').forEach(cell => {
                cell.className = 'demo-cell';
                cell.textContent = '';
                cell.style.backgroundColor = '';
            });
            
            document.querySelectorAll('.grid-cell').forEach(cell => {
                cell.className = 'grid-cell';
            });
            
            // Update demo grid with modules
            this.robot.modules.forEach(module => {
                const cellIndex = module.y * 6 + module.x;
                const cells = document.querySelectorAll('.demo-cell');
                
                if (cells[cellIndex]) {
                    cells[cellIndex].className = 'demo-cell module';
                    cells[cellIndex].style.backgroundColor = module.color;
                    cells[cellIndex].textContent = module.id;
                }
            });
            
            // Update hero grid (simpler visualization)
            // For hero, we'll show a subset or different arrangement
            const heroModules = this.robot.modules.slice(0, 5);
            heroModules.forEach((module, index) => {
                // Map to hero grid (5x5)
                const heroX = index % 5;
                const heroY = Math.floor(index / 5);
                const heroCellIndex = heroY * 5 + heroX;
                const heroCells = document.querySelectorAll('.grid-cell');
                
                if (heroCells[heroCellIndex]) {
                    heroCells[heroCellIndex].className = 'grid-cell active';
                    heroCells[heroCellIndex].style.backgroundColor = module.color;
                }
            });
        }
        
        startAnimationLoop() {
            const animate = () => {
                if (this.isAnimating) {
                    const stillMoving = this.robot.update();
                    
                    if (!stillMoving) {
                        this.isAnimating = false;
                        this.statusIndicator.style.backgroundColor = '#10b981';
                    }
                    
                    this.updateGrids();
                }
                
                requestAnimationFrame(animate);
            };
            
            animate();
        }
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Initialize the demo visualization
    const demo = new DemoVisualization();
    
    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        }
    });
    
    // Add hover effect to grid cells in demo
    document.addEventListener('mouseover', function(e) {
        if (e.target.classList.contains('demo-cell') && e.target.classList.contains('module')) {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.zIndex = '10';
        }
    });
    
    document.addEventListener('mouseout', function(e) {
        if (e.target.classList.contains('demo-cell') && e.target.classList.contains('module')) {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.zIndex = '';
        }
    });
    
    // Initialize with a random configuration in hero section
    function animateHeroSection() {
        const heroCells = document.querySelectorAll('.grid-cell');
        heroCells.forEach(cell => {
            cell.classList.remove('active');
        });
        
        // Randomly activate some cells
        const activeCount = Math.floor(Math.random() * 5) + 3;
        for (let i = 0; i < activeCount; i++) {
            const randomIndex = Math.floor(Math.random() * heroCells.length);
            heroCells[randomIndex].classList.add('active');
            
            // Random color for hero cells
            const colors = ['#2563eb', '#10b981', '#8b5cf6', '#f59e0b', '#0ea5e9'];
            heroCells[randomIndex].style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        }
    }
    
    // Change hero animation every 3 seconds
    setInterval(animateHeroSection, 3000);
    
    // Initial hero animation
    setTimeout(animateHeroSection, 500);
});
