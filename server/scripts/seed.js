const mongoose = require('mongoose');
const Subject = require('../models/Subject');
const Chapter = require('../models/Chapter');
const Topic = require('../models/Topic');
const Assessment = require('../models/Assessment');
require('dotenv').config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/daz_learning');
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await Subject.deleteMany();
        await Chapter.deleteMany();
        await Topic.deleteMany();
        await Assessment.deleteMany();

        // 1. Seed Subjects
        const subjects = [
            { name: 'Mathematics' },
            { name: 'Physics' },
            { name: 'Chemistry' }
        ];

        const seededSubjects = {};
        for (let s of subjects) {
            const subject = new Subject(s);
            await subject.save();
            seededSubjects[s.name] = subject._id;
        }

        console.log('Seeded subjects.');

        // 2. Seed Mathematics Chapters, Topics, and Assessments
        const mathId = seededSubjects['Mathematics'];
        
        // --- Math Chapter 1 ---
        const mathCh1 = new Chapter({
            subjectId: mathId,
            chapterName: 'Chapter 1: Applications of Matrices and Determinants',
            order: 1
        });
        await mathCh1.save();

        // Topic 1.1
        const mathTopic1_1 = new Topic({
            chapterId: mathCh1._id,
            topicName: 'Row Echelon Form',
            order: 1
        });
        await mathTopic1_1.save();

        const mathAss1_1 = new Assessment({
            topicId: mathTopic1_1._id,
            questions: [
                {
                    questionText: 'The process of converting a matrix to Row Echelon Form is called:',
                    options: ['Matrix inversion', 'Gaussian Elimination', 'LU Decomposition', 'Gram-Schmidt Process'],
                    correctAnswer: 1,
                    conceptTag: 'Gaussian Elimination'
                },
                {
                    questionText: 'In Row Echelon Form, what must be true about rows consisting entirely of zeros?',
                    options: ['They must appear at the top', 'They must appear in the middle', 'They must appear at the bottom', 'They cannot exist'],
                    correctAnswer: 2,
                    conceptTag: 'Row Echelon Form Properties'
                },
                {
                    questionText: 'Which elementary row operation is NOT valid when reducing a matrix?',
                    options: ['Swapping two rows', 'Multiplying a row by a non-zero scalar', 'Adding a multiple of one row to another', 'Multiplying a row by zero'],
                    correctAnswer: 3,
                    conceptTag: 'Elementary Row Operations'
                },
                {
                    questionText: 'What is the pivot in a row?',
                    options: ['The last non-zero entry in a row', 'The first non-zero entry in a row', 'The largest entry in a row', 'The entry on the main diagonal'],
                    correctAnswer: 1
                },
                {
                    questionText: 'How many pivots does a 3x3 identity matrix have in Row Echelon Form?',
                    options: ['1', '2', '3', '0'],
                    correctAnswer: 2
                },
                {
                    questionText: 'A matrix is said to be in Row Echelon Form if:',
                    options: ['All pivots equal 1', 'All entries below each pivot are zero', 'All entries above and below each pivot are zero', 'The matrix is square'],
                    correctAnswer: 1
                },
                {
                    questionText: 'The number of non-zero rows in a row echelon form matrix represents its:',
                    options: ['Determinant', 'Rank', 'Dimension', 'Trace'],
                    correctAnswer: 1
                },
                {
                    questionText: 'Which statement about Row Echelon Form is FALSE?',
                    options: ['Every matrix has a unique Row Echelon Form', 'Every matrix has a unique Reduced Row Echelon Form', 'Row Echelon Form is not unique but Reduced Row Echelon Form is', 'Row operations are reversible'],
                    correctAnswer: 0
                },
                {
                    questionText: 'Which of the following is a requirement for a matrix to be in Row Echelon Form?',
                    options: ['All entries must be 1 or 0', 'The pivot in each row must be to the left of the leading entry in the row below', 'The pivot in each row must be to the right of the leading entry in the row below', 'All diagonal entries must be 1'],
                    correctAnswer: 2
                },
                {
                    questionText: 'What happens to the solution set when you multiply a row by a non-zero scalar?',
                    options: ['It remains unchanged', 'It doubles', 'It becomes empty', 'A new solution is added'],
                    correctAnswer: 0
                }
            ],
            passScore: 70
        });
        await mathAss1_1.save();

        // Topic 1.2: Rank of a Matrix
        const mathTopic1_2 = new Topic({
            chapterId: mathCh1._id,
            topicName: 'Rank of a Matrix',
            order: 2
        });
        await mathTopic1_2.save();

        const mathAss1_2 = new Assessment({
            topicId: mathTopic1_2._id,
            questions: [
                {
                    questionText: 'The rank of a matrix A is defined as:',
                    options: ['Number of rows in A', 'Number of non-zero rows in its Row Echelon Form', 'Determinant of A', 'Sum of diagonal elements'],
                    correctAnswer: 1
                },
                {
                    questionText: 'If matrix A is of order 3x4, the maximum possible rank of A is:',
                    options: ['3', '4', '7', '12'],
                    correctAnswer: 0
                },
                {
                    questionText: 'The rank of a zero matrix is always:',
                    options: ['1', '0', 'Undefined', '-1'],
                    correctAnswer: 1
                },
                {
                    questionText: 'If A is an n x n non-singular matrix, then rank(A) is:',
                    options: ['0', 'n - 1', 'n', '1'],
                    correctAnswer: 2
                },
                {
                    questionText: 'Elementary row operations on a matrix:',
                    options: ['Change its rank', 'Do not change its rank', 'Double its rank', 'Make its rank zero'],
                    correctAnswer: 1
                }
            ],
            passScore: 70
        });
        await mathAss1_2.save();

        // Topic 1.3: Inverse of a Non-Singular Matrix
        const mathTopic1_3 = new Topic({
            chapterId: mathCh1._id,
            topicName: 'Inverse of a Non-Singular Matrix',
            order: 3
        });
        await mathTopic1_3.save();

        const mathAss1_3 = new Assessment({
            topicId: mathTopic1_3._id,
            questions: [
                {
                    questionText: 'A square matrix A has an inverse if and only if:',
                    options: ['det(A) = 0', 'det(A) ≠ 0', 'A is symmetric', 'A is diagonal'],
                    correctAnswer: 1
                },
                {
                    questionText: 'The formula for finding the inverse of matrix A is:',
                    options: ['adj(A) / det(A)', 'det(A) * adj(A)', '1 / adj(A)', 'A^T / det(A)'],
                    correctAnswer: 0
                },
                {
                    questionText: 'If A and B are invertible matrices of the same order, then (AB)^(-1) equals:',
                    options: ['A^(-1) B^(-1)', 'B^(-1) A^(-1)', 'AB', 'BA'],
                    correctAnswer: 1
                }
            ],
            passScore: 70
        });
        await mathAss1_3.save();

        // Topic 1.4: Applications of Matrices - System of Linear Equations
        const mathTopic1_4 = new Topic({
            chapterId: mathCh1._id,
            topicName: 'Applications of Matrices - Solving Systems',
            order: 4
        });
        await mathTopic1_4.save();

        const mathAss1_4 = new Assessment({
            topicId: mathTopic1_4._id,
            questions: [
                {
                    questionText: 'In Matrix Inversion Method, the system AX = B is solved by:',
                    options: ['X = A^(-1) B', 'X = B A^(-1)', 'X = A B', 'X = adj(A) B'],
                    correctAnswer: 0
                },
                {
                    questionText: 'Cramer Rule can be applied to solve AX = B only when:',
                    options: ['det(A) = 0', 'det(A) ≠ 0', 'A is non-square', 'B is zero vector'],
                    correctAnswer: 1
                }
            ],
            passScore: 70
        });
        await mathAss1_4.save();

        // Topic 1.5: Gaussian Elimination Method
        const mathTopic1_5 = new Topic({
            chapterId: mathCh1._id,
            topicName: 'Gaussian Elimination Method',
            order: 5
        });
        await mathTopic1_5.save();

        const mathAss1_5 = new Assessment({
            topicId: mathTopic1_5._id,
            questions: [
                {
                    questionText: 'In Gaussian Elimination, the augmented matrix [A|B] is reduced to:',
                    options: ['Identity Form', 'Row Echelon Form', 'Diagonal Form', 'Transpose Form'],
                    correctAnswer: 1
                },
                {
                    questionText: 'After reducing [A|B] to Row Echelon Form, variables are solved using:',
                    options: ['Forward substitution', 'Back substitution', 'Matrix multiplication', 'Cramer Rule'],
                    correctAnswer: 1
                }
            ],
            passScore: 70
        });
        await mathAss1_5.save();

        // Topic 1.6: Consistency of Non-Homogeneous Linear Equations
        const mathTopic1_6 = new Topic({
            chapterId: mathCh1._id,
            topicName: 'Consistency of Non-Homogeneous Equations',
            order: 6
        });
        await mathTopic1_6.save();

        const mathAss1_6 = new Assessment({
            topicId: mathTopic1_6._id,
            questions: [
                {
                    questionText: 'A system of linear equations AX = B is consistent if:',
                    options: ['rank(A) = rank([A|B])', 'rank(A) < rank([A|B])', 'rank(A) > rank([A|B])', 'rank([A|B]) = 0'],
                    correctAnswer: 0
                },
                {
                    questionText: 'If rank(A) = rank([A|B]) = n (number of unknowns), the system has:',
                    options: ['A unique solution', 'Infinitely many solutions', 'No solution', 'Trivial solution only'],
                    correctAnswer: 0
                },
                {
                    questionText: 'If rank(A) = rank([A|B]) < n, the system has:',
                    options: ['A unique solution', 'Infinitely many solutions', 'No solution', 'Zero solutions'],
                    correctAnswer: 1
                }
            ],
            passScore: 70
        });
        await mathAss1_6.save();

        // Topic 1.7: Homogeneous Linear Equations
        const mathTopic1_7 = new Topic({
            chapterId: mathCh1._id,
            topicName: 'Homogeneous Linear Equations',
            order: 7
        });
        await mathTopic1_7.save();

        const mathAss1_7 = new Assessment({
            topicId: mathTopic1_7._id,
            questions: [
                {
                    questionText: 'A homogeneous system AX = 0 always has at least the solution:',
                    options: ['Trivial solution (X = 0)', 'Non-trivial solution', 'No solution', 'Undefined solution'],
                    correctAnswer: 0
                },
                {
                    questionText: 'A homogeneous system AX = 0 has a non-trivial solution if and only if:',
                    options: ['det(A) ≠ 0', 'det(A) = 0', 'rank(A) = n', 'A is identity matrix'],
                    correctAnswer: 1
                }
            ],
            passScore: 70
        });
        await mathAss1_7.save();


        // --- Math Chapter 2 ---
        const mathCh2 = new Chapter({
            subjectId: mathId,
            chapterName: 'Chapter 2: Complex Numbers',
            order: 2
        });
        await mathCh2.save();

        const mathTopic2_1 = new Topic({
            chapterId: mathCh2._id,
            topicName: 'Basic Algebraic Properties of Complex Numbers',
            order: 1
        });
        await mathTopic2_1.save();

        const mathAss2_1 = new Assessment({
            topicId: mathTopic2_1._id,
            questions: [
                {
                    questionText: 'Which of the following correctly states the commutative property under addition for complex numbers?',
                    options: ['z₁ + z₂ = z₁ − z₂', 'z₁ · z₂ = z₂ + z₁', 'z₁ + z₂ = z₂ + z₁', 'z₁ + z₂ = z₁ · z₂'],
                    correctAnswer: 2
                },
                {
                    questionText: 'Which expression correctly shows the associative property of multiplication for complex numbers?',
                    options: ['(z₁ · z₂) + z₃ = z₁ · (z₂ + z₃)', '(z₁ · z₂) · z₃ = z₁ · (z₂ · z₃)', 'z₁ · z₂ = z₂ · z₁', 'z₁ · (z₂ + z₃) = z₁z₂ + z₁z₃'],
                    correctAnswer: 1
                },
                {
                    questionText: 'What is the additive identity for complex numbers?',
                    options: ['1', 'i', '0 + 0i', '1 + 0i'],
                    correctAnswer: 2
                },
                {
                    questionText: 'What is the multiplicative identity for complex numbers?',
                    options: ['0', 'i', '0 + i', '1 = 1 + 0i'],
                    correctAnswer: 3
                },
                {
                    questionText: 'For which values of z does the multiplicative inverse z⁻¹ NOT exist?',
                    options: ['When z is purely real', 'When z = 0', 'When z is purely imaginary', 'When z has a negative real part'],
                    correctAnswer: 1
                },
                {
                    questionText: 'If z = 3 + 4i, what is the denominator used in computing z⁻¹?',
                    options: ['7', '12', '25', '1'],
                    correctAnswer: 2
                },
                {
                    questionText: 'Which property directly tells us that (z₁ + z₂) + z₃ = z₁ + (z₂ + z₃)?',
                    options: ['Commutative property of addition', 'Distributive property', 'Associative property of addition', 'Additive identity'],
                    correctAnswer: 2
                },
                {
                    questionText: 'Division of z₁ by z₂ (z₂ ≠ 0) is formally written as:',
                    options: ['z₁ − z₂', 'z₁ · z₂', 'z₁ · z₂⁻¹', 'z₁ + (−z₂)'],
                    correctAnswer: 2
                },
                {
                    questionText: 'What does the commutative property under multiplication state?',
                    options: ['z₁ + z₂ = z₂ + z₁', 'z₁ · z₂ = z₁ + z₂', 'z₁ · z₂ = z₂ · z₁', 'z₁ · (z₂ · z₃) = (z₁ · z₂) · z₃'],
                    correctAnswer: 2
                },
                {
                    questionText: 'If z = x + iy, which expression gives z⁻¹?',
                    options: ['x/(x²+y²) + i·y/(x²+y²)', 'x/(x²+y²) − i·y/(x²+y²)', '−x/(x²+y²) + i·y/(x²+y²)', '1/(x+y)'],
                    correctAnswer: 1
                }
            ],
            passScore: 70
        });
        await mathAss2_1.save();

        // --- Math Chapter 3 ---
        const mathCh3 = new Chapter({
            subjectId: mathId,
            chapterName: 'Chapter 3: Theory of Equations',
            order: 3
        });
        await mathCh3.save();

        // Topic 3.1
        const mathTopic3_1 = new Topic({
            chapterId: mathCh3._id,
            topicName: 'Introduction to Theory of Equations',
            order: 1
        });
        await mathTopic3_1.save();

        const mathAss3_1 = new Assessment({
            topicId: mathTopic3_1._id,
            questions: [
                {
                    questionText: 'Which subject area does the Theory of Equations belong to?',
                    options: ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
                    correctAnswer: 2
                },
                {
                    questionText: 'Who gave an approximate solution to "Squaring a circle" in his Note Book?',
                    options: ['Euclid', 'Abel', 'Srinivasa Ramanujan', 'Fibonacci'],
                    correctAnswer: 2
                },
                {
                    questionText: 'Using only a compass and ruler, which of the following CAN be constructed?',
                    options: ['Trisecting an angle', 'Doubling a cube', 'A regular hexagon', 'Squaring a circle'],
                    correctAnswer: 2
                },
                {
                    questionText: 'What type of equations do most real-life problems turn into when converted mathematically?',
                    options: ['Linear equations', 'Trigonometric equations', 'Polynomial equations', 'Logarithmic equations'],
                    correctAnswer: 2
                },
                {
                    questionText: 'A circle and a straight line can intersect at most at how many points?',
                    options: ['1', '2', '3', '4'],
                    correctAnswer: 1
                },
                {
                    questionText: 'In the box problem, if the breadth is x, what is the length of the base?',
                    options: ['x + 3', 'x + 9', 'x + 6', '2x'],
                    correctAnswer: 2
                },
                {
                    questionText: 'Which mathematician first solved quadratic equations involving negative numbers?',
                    options: ['Euclid', 'Brahmagupta', 'Omar Khayyam', 'Descartes'],
                    correctAnswer: 1
                },
                {
                    questionText: 'What was the volume of the box in the manufacturing problem given in the introduction?',
                    options: ['1000 cubic units', '1618 cubic units', '2618 cubic units', '3618 cubic units'],
                    correctAnswer: 2
                },
                {
                    questionText: 'Abel proved in 1823 that there is no algebraic formula to solve equations of degree:',
                    options: ['3', '4', '5', '6'],
                    correctAnswer: 2
                },
                {
                    questionText: 'In the box problem, the height of the box is the average of the length and the breadth. If breadth = x, what is the height?',
                    options: ['x + 6', 'x + 3', 'x + 4.5', '2x + 6'],
                    correctAnswer: 1
                }
            ],
            passScore: 70
        });
        await mathAss3_1.save();

        // Topic 3.2
        const mathTopic3_2 = new Topic({
            chapterId: mathCh3._id,
            topicName: 'Basics of Polynomial Equations',
            order: 2
        });
        await mathTopic3_2.save();

        const mathAss3_2 = new Assessment({
            topicId: mathTopic3_2._id,
            questions: [
                {
                    questionText: 'The degree of the polynomial 5x³ + 2x − 1 is:',
                    options: ['1', '2', '3', '5'],
                    correctAnswer: 2
                },
                {
                    questionText: 'A polynomial with leading coefficient 1 is called:',
                    options: ['Cubic polynomial', 'Monic polynomial', 'Quartic polynomial', 'Zero polynomial'],
                    correctAnswer: 1
                },
                {
                    questionText: 'Which of the following is a quadratic polynomial?',
                    options: ['x³+2x+1', 'x²−4x+5', 'x⁴+1', 'x+1'],
                    correctAnswer: 1
                },
                {
                    questionText: 'The coefficient of x² in 3x²+5x−1 is:',
                    options: ['2', '3', '5', '−1'],
                    correctAnswer: 1
                },
                {
                    questionText: 'The polynomial of degree 3 is called:',
                    options: ['Quadratic', 'Quartic', 'Cubic', 'Linear'],
                    correctAnswer: 2
                },
                {
                    questionText: 'Which of the following is the zero polynomial?',
                    options: ['x', '1', 'x+1', '0'],
                    correctAnswer: 3
                },
                {
                    questionText: 'Which of the following is NOT a polynomial?',
                    options: ['3x²+1', 'x³−x+2', '3x⁻²+1', '5x+4'],
                    correctAnswer: 2
                },
                {
                    questionText: 'The degree of every nonzero constant polynomial is:',
                    options: ['0', '1', '2', 'Not defined'],
                    correctAnswer: 0
                },
                {
                    questionText: 'Which statement is an identity?',
                    options: ['sin x + cos x = 1', 'sin³x + cos³x = 1', 'sin²x + cos²x = 1', 'sin x = 0'],
                    correctAnswer: 2
                },
                {
                    questionText: 'If c makes P(c)=0, then c is called a:',
                    options: ['Coefficient', 'Variable', 'Zero of the polynomial', 'Degree'],
                    correctAnswer: 2
                }
            ],
            passScore: 70
        });
        await mathAss3_2.save();

        // Topic 3.3
        const mathTopic3_3 = new Topic({
            chapterId: mathCh3._id,
            topicName: "Vieta's Formula for Polynomial Equations",
            order: 3
        });
        await mathTopic3_3.save();

        const mathAss3_3 = new Assessment({
            topicId: mathTopic3_3._id,
            questions: [
                {
                    questionText: 'If a is a root of P(x) = 0, which of the following is a factor of P(x)?',
                    options: ['(x - a)', '(x + a)', '(a - x)', 'x'],
                    correctAnswer: 0
                },
                {
                    questionText: 'What is the maximum number of roots a polynomial equation of degree 4 can have?',
                    options: ['1', '6', '8', '4'],
                    correctAnswer: 3
                },
                {
                    questionText: 'According to the Fundamental Theorem of Algebra, a polynomial equation of degree n >= 1 has at least one ________ root:',
                    options: ['real', 'complex', 'two roots', 'three roots'],
                    correctAnswer: 1
                },
                {
                    questionText: 'What is the sum of the roots of the equation x² - 7x + 12 = 0?',
                    options: ['5', '6', '7', '8'],
                    correctAnswer: 2
                },
                {
                    questionText: 'If a and b are roots of x² - 5x + 6 = 0, what is the value of ab?',
                    options: ['0', '6', '2', '3'],
                    correctAnswer: 1
                },
                {
                    questionText: "According to Vieta's formulas, for the equation x² - 9x + 20 = 0, what is the value of a + b?",
                    options: ['3', '5', '7', '9'],
                    correctAnswer: 3
                },
                {
                    questionText: 'What is the product of the roots of the equation x² - 7x + 12 = 0?',
                    options: ['9', '3', '12', '8'],
                    correctAnswer: 2
                },
                {
                    questionText: 'If the roots of a cubic equation are 1, 2, and 3, find the value of a + b + c.',
                    options: ['4', '5', '6', '7'],
                    correctAnswer: 2
                },
                {
                    questionText: 'If the roots of a cubic equation are 1, 2, and 3, find the value of ab + bc + ca.',
                    options: ['11', '10', '16', '20'],
                    correctAnswer: 0
                },
                {
                    questionText: 'If a and b are the roots of 2x² - 7x + 13 = 0, the value of a² + b² is:',
                    options: ['3/4', '49/2', '169/4', '-3/4'],
                    correctAnswer: 3
                }
            ],
            passScore: 70
        });
        await mathAss3_3.save();

        // --- Math Chapter 4 ---
        const mathCh4 = new Chapter({
            subjectId: mathId,
            chapterName: 'Chapter 4: Inverse Trigonometric Functions',
            order: 4
        });
        await mathCh4.save();

        const mathTopic4_1 = new Topic({
            chapterId: mathCh4._id,
            topicName: 'Introduction to Inverse Trigonometric Functions',
            order: 1
        });
        await mathTopic4_1.save();

        const mathAss4_1 = new Assessment({
            topicId: mathTopic4_1._id,
            questions: [
                {
                    questionText: 'What is the principal value branch of sin⁻¹(x)?',
                    options: ['[-π/2, π/2]', '(0, π)', '[0, π]', '(-π/2, π/2)'],
                    correctAnswer: 0
                },
                {
                    questionText: 'What is the value of cos⁻¹(1/2)?',
                    options: ['π/6', 'π/3', 'π/4', 'π/2'],
                    correctAnswer: 1
                }
            ],
            passScore: 70
        });
        await mathAss4_1.save();

        console.log('Seeded Mathematics syllabus.');

        // 3. Seed Physics and Chemistry placeholder Chapters and Topics
        const otherSubjects = ['Physics', 'Chemistry'];
        for (let name of otherSubjects) {
            const subjectId = seededSubjects[name];
            
            const ch1 = new Chapter({
                subjectId,
                chapterName: `Chapter 1: Foundations of ${name}`,
                order: 1
            });
            await ch1.save();

            const topic1 = new Topic({
                chapterId: ch1._id,
                topicName: `Topic 1.1: Introduction to ${name}`,
                order: 1
            });
            await topic1.save();

            const ass1 = new Assessment({
                topicId: topic1._id,
                questions: [
                    {
                        questionText: `What is the primary focus of ${name}?`,
                        options: ['Option A', 'Option B', 'Option C', 'Option D'],
                        correctAnswer: 0
                    }
                ],
                passScore: 70
            });
            await ass1.save();
        }

        console.log('Seeding completed successfully!');
        process.exit();
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seedData();
