export default function({types: t }) {
  const visitor = {
    ForOfStatement(path) {
      const loose = this.opts.loose;
      const { scope } = path;
      const { left, right, body} = path.node;
      const i = scope.generateUidIdentifier("i");
      const length = scope.generateUidIdentifier("length");
      let array = scope.maybeGenerateMemoised(right, true);

      const inits = [ t.variableDeclarator(i, t.numericLiteral(0)) ];
      if (array) {
        inits.push(t.variableDeclarator(array, right));
      } else {
        array = right;
      }
      inits.push(t.variableDeclarator(
        length,
        t.memberExpression(t.clone(array), t.identifier("length"))
      ));

      if (loose) {
        const variable = inits[inits.length - 1];
        variable.init = t.conditionalExpression(
          t.binaryExpression("==", t.clone(array), t.nullLiteral()),
          t.numericLiteral(0),
          variable.init
        );
      }

      const item = t.memberExpression(array, t.clone(i), true);
      let assignment;
      if (t.isVariableDeclaration(left)) {
        assignment = left;
        assignment.declarations[0].init = item;
      } else {
        assignment = t.expressionStatement(t.assignmentExpression("=", left, item));
      }

      const block = t.toBlock(body);
      block.body.unshift(assignment);

      path.replaceWith(t.forStatement(
        t.variableDeclaration("let", inits),
        t.binaryExpression("<", t.clone(i), t.clone(length)),
        t.updateExpression("++", t.clone(i)),
        block
      ));
    }
  };

  return { visitor };
}
