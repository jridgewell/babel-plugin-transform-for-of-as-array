export default function({types: t }) {
  const visitor = {
    ForOfStatement(path) {
      const { scope } = path;

      const { left, right, body} = path.node;
      const iterator = scope.maybeGenerateMemoised(right, true);
      const i = scope.generateUidIdentifier("i");

      const item = t.memberExpression(iterator, i, true);
      let assignment;
      if (t.isVariableDeclaration(left)) {
        assignment = left;
        assignment.declarations[0].init = item;
      } else {
        assignment = t.expressionStatement(t.assignmentExpression("=", left, item));
      }
      path.get("body").unshiftContainer("body", assignment);

      path.replaceWith(t.forStatement(
        t.variableDeclaration("let", [
          t.variableDeclarator(i, t.numericLiteral(0)),
          t.variableDeclarator(iterator, right),
        ]),
        t.binaryExpression("<", i, t.memberExpression(iterator, t.identifier("length"))),
        t.updateExpression("++", i),
        body
      ));
    }
  };

  return { visitor };
}
