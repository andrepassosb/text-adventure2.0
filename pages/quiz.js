/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
import React from 'react';
import db from '../db.json';
import Widget from '../src/components/Widget';
import QuizLogo from '../src/components/QuizLogo';
import QuizBackground from '../src/components/QuizBackground';
import QuizContainer from '../src/components/QuizContainer';
import AlternativesForm from '../src/components/AlternativesForm';
import Button from '../src/components/Button';
import styled from 'styled-components';
import { Book } from '@styled-icons/fa-solid/';
import { Letsencrypt } from 'styled-icons/simple-icons';
import Typed from 'react-typed';


const Li = styled.li`
  // list-style-type:none
`



function Adventure({seletcs,currentQuestion,currentTitle}) {
  return (

        <Widget>
      <Widget.Header>
        <h3>
          "Kolb and the Dragon: A book for Nord Boy"
        </h3>
      </Widget.Header>

      <Widget.Content>
       <p>
         {currentTitle.map((currentTitle) => 
         <Li><h1>
         <Typed
          strings={[currentTitle]}
          typeSpeed={20}
          showCursor={false}
         />
         </h1></Li>)
        //  {/* <Book size="20" />{' '} */}
       }         
        </p>
        {/* <ul>{seletcs} - {currentQuestion}</ul> */}
      </Widget.Content>
    </Widget>
  );
}

function QuestionWidget({
  question,
  questionIndex,
  onSubmit,
  addSelect,
}) {
  const [selectedAlternative, setSelectedAlternative] = React.useState([]);
  const [isQuestionSubmited, setIsQuestionSubmited] = React.useState(false);
  const questionId = `question__${questionIndex}`;
  const isCorrect = selectedAlternative === 0;

  return (
    <Widget>
      <Widget.Content>
        {/* <h2>
          {question.title}
        </h2> */}
        <p>
          {question.description}  
        </p>

        <AlternativesForm
          onSubmit={(infosDoEvento) => {
            infosDoEvento.preventDefault();
            setIsQuestionSubmited(true);
            addSelect(selectedAlternative);
            //console.log(selectedAlternative);
            setTimeout(() => {
              onSubmit();
              setIsQuestionSubmited(false);
            }, 1 * 1000);
          }}
        >
          {question.alternatives.text.map((alternative, alternativeIndex) => {
            const alternativeId = `alternative__${alternativeIndex}`;
            const alternativeStatus = isCorrect ? 'SUCCESS' : 'ERROR';
            const isSelected = selectedAlternative === alternativeIndex;
            return (
              <Widget.Topic
                as="label"
                key={alternativeId}
                htmlFor={alternativeId}
                data-selected={isSelected}
                data-status={isQuestionSubmited && alternativeStatus}
              >
                <input
                  style={{ display: 'none' }}
                  id={alternativeId}
                  name={questionId}
                  onChange={() => setSelectedAlternative(alternativeIndex)}
                  type="radio"
                />
                {alternative}
                
              </Widget.Topic>
            );
          })}
          <Button type="submit">
            Confirmar
          </Button>
        </AlternativesForm>
      </Widget.Content>
    </Widget>
  );
}

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT',
};
export default function QuizPage() {
  const [screenState, setScreenState] = React.useState(screenStates.LOADING);
  const [selects,setSelect] = React.useState([]);
  const totalQuestions = db.questions.length;
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [currentQuestionArray, setCurrentQuestionArray] = React.useState([0]);
  const questionIndex = currentQuestion;
  const question = db.questions[questionIndex];
  let selected = 0;
  
  function CurrentQuestionArray (currentQuestion){
    setCurrentQuestionArray([...currentQuestionArray,currentQuestion]);
    //console.log(currentQuestionArray)
  }
  
 
  function addSelect(select) {
    //console.log(select);
    setSelect([...selects,select]);
    //console.log(selects);
    selected = select;
    return selected;
  }
  
  
  // [React chama de: Efeitos || Effects]
  // React.useEffect
  // atualizado === willUpdate
  // morre === willUnmount
  React.useEffect(() => {
    // fetch() ...
    setTimeout(() => {
      setScreenState(screenStates.QUIZ);
    }, 0.1 * 1000);
    // nasce === didMount
  }, []);
  
  const startTitle = db.questions[0].title;
  const [currentTitleArray, setCurrentTitle] = React.useState([startTitle]);
  
  function CurrentTitleArray (currentTitle){
    setCurrentTitle([...currentTitleArray,currentTitle]);
   }
   
  function onEsvaziarArray () {
    setCurrentTitle([startTitle]);
    console.log('foi executado',currentTitleArray);
  }
  
  function handleSubmitQuiz() {
    const nextQuestion = db.questions[questionIndex].alternatives.route[selected] - 1;
    if (nextQuestion === 0) {
      onEsvaziarArray ();         
    }
    setCurrentQuestion(nextQuestion);
    CurrentQuestionArray(nextQuestion);
    const nextQuestionTitle = db.questions[nextQuestion].title;
    CurrentTitleArray(nextQuestionTitle)
  }

  return (
    <QuizBackground backgroundImage={db.bg}>
      <QuizContainer>
        <QuizLogo />
      <Adventure  
      seletcs={selects}
      currentQuestion={currentQuestionArray}
      currentTitle={currentTitleArray}/>
        {screenState === screenStates.QUIZ && (
          <QuestionWidget
            question={question}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            onSubmit={handleSubmitQuiz}
            addSelect={addSelect}
            selects={selects}
          />
        )}
      </QuizContainer>
    </QuizBackground>
  );
}

