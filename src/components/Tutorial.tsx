import { Messenger } from '@figmania/common'
import { Button } from '@figmania/ui'
import { Component } from 'react'

export class Tutorial extends Component<{ show: boolean, messenger: Messenger }> {
  render() {
    if (!this.props.show) { return <Button className="tutorial-button" title="Show Tutorial" onClick={() => { this.props.messenger.request<boolean, boolean>('tutorial', true) }}></Button> }
    return <div className="tutorial">
      <div className="tutorial-section">How to create Animations</div>
      <div className="tutorial-step"><strong>Step 1:</strong> Select the Frame you want to animate and click on <strong>Enable SVG Export</strong>.</div>
      <div className="tutorial-step"><strong>Step 2:</strong> Select a node within that Frame to set up animations such as X Position, Y Position, Scale, Rotation and Opacity.</div>
      <div className="tutorial-step"><strong>Step 3:</strong> Use the built-in live-preview to tweak your animations until you're happy with the result.</div>
      <div className="tutorial-step"><strong>Step 4:</strong> Download or copy the animated SVG and paste it on your website.</div>

      <div className="tutorial-section">How to use Animations</div>
      <div className="tutorial-step"><strong>•</strong> SVG Animate uses a small web component library under the hood to make your animations work.</div>
      <div className="tutorial-step"><strong>•</strong> This library uses GreenSock GSAP, a powerful, lightweight and performant animation engine.</div>
      <div className="tutorial-step"><strong>•</strong> When exporting from SVG Animate, you can download or copy the snippet with the click of a button, and paste it on your website. No complicated setup needed.</div>

      <Button className="tutorial-button" title="Hide Tutorial" onClick={() => { this.props.messenger.request<boolean, boolean>('tutorial', false) }}></Button>
    </div>
  }
}