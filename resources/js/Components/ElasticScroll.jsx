import { cloneElement, useEffect, useRef } from 'react'
import elasticScroll from 'elastic-scroll-polyfill'

const ElasticScroll = ({ children, ...props }) => {
    const targetRef = useRef()

    useEffect(() => {
        const instance = elasticScroll({
            targets: targetRef.current,
            ...props
        })

        return () => {
            instance.disable()
        }
    }, [])
    return cloneElement(children, {
        children: <div data-elastic-wrapper>{children.props.children}</div>,
        ref: node => {
            targetRef.current = node
            const { ref } = children
            if (ref) {
                if (typeof ref === 'function') {
                    ref(node)
                } else if (ref.hasOwnProperty('current')) {
                    ref.current = node
                }
            }
        }
    })
}

export default ElasticScroll
