export const a = () => {
    return (
        <div>
            hello
        </div>
    )
}

// export default () => {
//     console.log(1)
// }

const Section = ({ sectionNumber, style, name, numberOfSections }) => {
    return (
      <div>
        <div id="pillarinfo" className="o-layout o-container o-layout--flush section u-padding-all-large">
          <p id="pillarname" className="o-layout__item u-width-1/3 c-heading-charlie section-title" style={style}>
            {name}
          </p>
          <p className="o-layout__item u-width-1/3 u-text-right section-number">
            Section <strong style={style}>{sectionNumber + 1}</strong> of{' '}
            <strong style={style}>{numberOfSections}</strong>
          </p>
        </div>
        <div id="pillarinfo-mobile" className="o-layout o-container o-layout--flush section u-padding-all-large">
          <div id="pillarname" className="o-layout--narrow c-heading-charlie section-title-center" style={style}>
            {name}
          </div>
          <div className="o-layout__item o-layout--center section-number u-padding-bottom-small">
            Section <strong style={style}>{sectionNumber + 1}</strong> of{' '}
            <strong style={style}>{numberOfSections}</strong>
          </div>
        </div>
      </div>
    );
  };
  
  Section.propTypes = {
    sectionNumber: PropTypes.number.isRequired,
    style: PropTypes.object,
    name: PropTypes.string.isRequired,
    numberOfSections: PropTypes.number.isRequired,
  };
  
  export default Section;