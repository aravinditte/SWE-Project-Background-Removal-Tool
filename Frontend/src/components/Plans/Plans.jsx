import React from 'react'
import whiteTick from '../../assets/whiteTick.png'
import RightArrow from '../../assets/rightArrow.png'
import {plansData} from '../../data/plansData'

import './Plan.css'

export const Plans = () => {
  return (
    <div className="plans-container">
      
        {/* header */}
        <div className="programs-heading">
              <span className='stroke-text'>ready to start</span>
              <span>your journey</span>
              <span className='stroke-text'>now with us</span>
        </div>

        <div className="blur blur-p-1"></div>
        <div className="blur blur-p-2"></div>
        
        <div className="plan-cards">
            {plansData.map((plan)=>(
                <div className="plan">
                    {plan.icon}
                    <span>{plan.name}</span>
                    <span>$ {plan.price}</span>
                    <div className="features">
                        {plan.features.map((feature, idx) => (
                            <div className="feature" key={idx}>
                                <img src={whiteTick} alt="" />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                    <div className="see-more-benifits">
                        <span>See more benifits</span>
                        <img src={RightArrow} alt="" />
                    </div>

                    <buttons className="btn">Join now</buttons>
                </div>
            ))
            }
        </div>
    </div>


    
  )
}

export default Plans