window.__stubsConfig__ = JSON.parse(/** @type {HTMLElement} */(document.querySelector('script[type="stubsConfig"]')).innerText)
const style = `
    #stubs-panel #stubs-icon {
        position: absolute;
        bottom: 50px;
        right: 50px;
        width: 50px;
        height: 50px;
        border-radius: 100px;
        background: #c05cf1;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99997;
        box-shadow: rgb(132 132 132) 2px 2px 4px;
    }
    
    #stubs-panel #stubs-icon:hover {
        cursor: pointer;
    }
    
    #stubs-panel #stubs-drawer-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #00000073;
        opacity: 0;
        transition: opacity 0.4s;
        display: none;
        z-index: 99999;
    }
    
    #stubs-panel #stubs-drawer-backdrop.open {
        opacity: 1;
    }
    
    #stubs-panel #stubs-drawer {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        width: 40%;
        background: #fff;
        transform: translateX(100%);
        transition: transform 0.4s;
    }
    
    #stubs-panel #stubs-drawer-backdrop.open #stubs-drawer {
        transform: translateX(0);
    }
    
    #stubs-panel iframe {
        border: 0;
        border-left: 1px solid #ccc;
    }
`

const $wrapper = document.createElement('div')
$wrapper.setAttribute('id', 'stubs-panel')
$wrapper.innerHTML = `
    <div id="stubs-icon" draggable="true">Stub</div>
    <div id="stubs-drawer-backdrop" class="close">
        <div id="stubs-drawer">
            <iframe width="100%" height="100%"></iframe>
        </div>
    </div>
`
document.body.append($wrapper)

injectStyle(style)
setPanelAnimation()
setIconDraggable($wrapper.querySelector('#stubs-icon'))

// ==================== Functions Definition =====================

function setPanelAnimation() {
    const $backdrop = $wrapper.querySelector('#stubs-drawer-backdrop')
    $wrapper.querySelector('#stubs-icon').addEventListener('click', function() {
        $backdrop.style.display = 'block'
        setTimeout(() => {
            $backdrop.classList.add('open')
            // reload iframe everytime
            $backdrop.querySelector('iframe').src = `${window.__stubsConfig__.protocol}://${window.__stubsConfig__.host}:${window.__stubsConfig__.port}`
        }, 1)
    })

    $backdrop.addEventListener('click', function() {
        $backdrop.classList.remove('open')
        setTimeout(() => {
            $backdrop.style.display = 'none'
        }, 400)
    })
}

function setIconDraggable($ele) {
    function dragStart(event) {
        const style = window.getComputedStyle(event.target, null)
        event.dataTransfer.setData(
            'text/plain',
            parseInt(style.getPropertyValue('left'), 10) -
            event.clientX +
            ',' +
            (parseInt(style.getPropertyValue('top'), 10) - event.clientY) +
            ',' +
            event.target.getAttribute('data-item'),
        )
    }

    function dragOver(event) {
        event.preventDefault()
        return false
    }

    function drop(event) {
        const offset = event.dataTransfer.getData('text/plain').split(',')
        $ele.style.left = event.clientX + parseInt(offset[0], 10) + 'px'
        $ele.style.top = event.clientY + parseInt(offset[1], 10) + 'px'
        event.preventDefault()
        return false
    }

    $ele.addEventListener('dragstart', dragStart, false)
    document.body.addEventListener('dragover', dragOver, false)
    document.body.addEventListener('drop', drop, false)
}

function injectStyle(content) {
    const css = document.createTextNode(content)
    const style = document.createElement('style')
    style.type = 'text/css'
    style.appendChild(css)
    document.getElementsByTagName('head')[0].appendChild(style)
}
