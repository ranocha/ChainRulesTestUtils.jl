var documenterSearchIndex = {"docs":
[{"location":"index.html#ChainRulesTestUtils","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils","text":"","category":"section"},{"location":"index.html","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils","text":"(Image: Travis) (Image: Code Style: Blue)","category":"page"},{"location":"index.html","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils","text":"ChainRulesTestUtils.jl helps you test ChainRulesCore.frule and ChainRulesCore.rrule methods, when adding rules for your functions in your own packages. For information about ChainRules, including how to write rules, refer to the general ChainRules Documentation: (Image: ) (Image: )","category":"page"},{"location":"index.html#Canonical-example","page":"ChainRulesTestUtils","title":"Canonical example","text":"","category":"section"},{"location":"index.html","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils","text":"Let's suppose a custom transformation has been defined","category":"page"},{"location":"index.html","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils","text":"function two2three(x1::Float64, x2::Float64)\n    return 1.0, 2.0*x1, 3.0*x2\nend","category":"page"},{"location":"index.html","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils","text":"along with the frule","category":"page"},{"location":"index.html","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils","text":"using ChainRulesCore\n\nfunction ChainRulesCore.frule((Δf, Δx1, Δx2), ::typeof(two2three), x1, x2)\n    y = two2three(x1, x2)\n    ∂y = Composite{Tuple{Float64, Float64, Float64}}(Zero(), 2.0*Δx1, 3.0*Δx2)\n    return y, ∂y\nend","category":"page"},{"location":"index.html","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils","text":"and rrule","category":"page"},{"location":"index.html","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils","text":"function ChainRulesCore.rrule(::typeof(two2three), x1, x2)\n    y = two2three(x1, x2)\n    function two2three_pullback(Ȳ)\n        return (NO_FIELDS, 2.0*Ȳ[2], 3.0*Ȳ[3])\n    end\n    return y, two2three_pullback\nend","category":"page"},{"location":"index.html","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils","text":"The test_frule/test_rrule helper function compares the frule/rrule outputs to the gradients obtained by finite differencing. They can be used for any type and number of inputs and outputs.","category":"page"},{"location":"index.html#Testing-the-frule","page":"ChainRulesTestUtils","title":"Testing the frule","text":"","category":"section"},{"location":"index.html","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils","text":"test_frule takes in the function f and the primal input x. The call will test the frule for function f at the point x in the domain. Keep this in mind when testing discontinuous rules for functions like ReLU, which should ideally be tested at both x being above and below zero.","category":"page"},{"location":"index.html","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils","text":"using ChainRulesTestUtils\n\ntest_frule(two2three, 3.33, -7.77);","category":"page"},{"location":"index.html#Testing-the-rrule","page":"ChainRulesTestUtils","title":"Testing the rrule","text":"","category":"section"},{"location":"index.html","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils","text":"test_rrule takes in the function f, and primal inputsr x. The call will test the rrule for function f at the point x, and similarly to frule some rules should be tested at multiple points in the domain.","category":"page"},{"location":"index.html","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils","text":"test_rrule(two2three, 3.33, -7.77);","category":"page"},{"location":"index.html#Scalar-example","page":"ChainRulesTestUtils","title":"Scalar example","text":"","category":"section"},{"location":"index.html","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils","text":"For functions with a single argument and a single output, such as e.g. ReLU,","category":"page"},{"location":"index.html","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils","text":"function relu(x::Real)\n    return max(0, x)\nend","category":"page"},{"location":"index.html","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils","text":"with the frule and rrule defined with the help of @scalar_rule macro","category":"page"},{"location":"index.html","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils","text":"@scalar_rule relu(x::Real) x <= 0 ? zero(x) : one(x)","category":"page"},{"location":"index.html","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils","text":"test_scalar function is provided to test both the frule and the rrule with a single call.","category":"page"},{"location":"index.html","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils","text":"test_scalar(relu, 0.5);\ntest_scalar(relu, -0.5);","category":"page"},{"location":"index.html#Specifying-Tangents","page":"ChainRulesTestUtils","title":"Specifying Tangents","text":"","category":"section"},{"location":"index.html","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils","text":"test_frule and test_rrule allow you to specify the tangents used for testing. This is done by passing in x ⊢ Δx, where x is the primal and Δx is the tangent, in the place of the primal inputs. If this is not done the tangent will be automatically generated via ChainRulesTestUtils.rand_tangent. A special case of this is that if you specify it as x ⊢ nothing then finite differencing will not be used on that input. Similarly, by setting the output_tangent keyword argument, you can specify the tangent for the primal output.","category":"page"},{"location":"index.html","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils","text":"This can be useful when the default provided ChainRulesTestUtils.rand_tangent doesn't produce the desired tangent for your type. For example the default tangent for an Int is DoesNotExist(). Which is correct e.g. when the Int represents a discrete integer like in indexing. But if you are testing something where the Int is actually a special case of a real number, then you would want to specify the tangent as a Float64.","category":"page"},{"location":"index.html","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils","text":"Care must be taken when manually specifying tangents. In particular, when specifying the input tangents to test_frule and the output tangent to test_rrule. As these tangents are used to seed the derivative computation. Inserting inappropriate zeros can thus hide errors.","category":"page"},{"location":"index.html#Custom-finite-differencing","page":"ChainRulesTestUtils","title":"Custom finite differencing","text":"","category":"section"},{"location":"index.html","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils","text":"If a package is using a custom finite differencing method of testing the frules and rrules, check_equal function provides a convenient way of comparing various types of differentials.","category":"page"},{"location":"index.html","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils","text":"It is effectively (a, b) -> @test isapprox(a, b), but it preprocesses thunks and ChainRules differential types Zero(), DoesNotExist(), and Composite, such that the error messages are helpful.","category":"page"},{"location":"index.html","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils","text":"For example,","category":"page"},{"location":"index.html","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils","text":"check_equal((@thunk 2*2.0), 4.1)","category":"page"},{"location":"index.html","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils","text":"shows both the expression and the evaluated thunks","category":"page"},{"location":"index.html","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils","text":"   Expression: isapprox(actual, expected; kwargs...)\n   Evaluated: isapprox(4.0, 4.1)\nERROR: There was an error during testing","category":"page"},{"location":"index.html","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils","text":"compared to","category":"page"},{"location":"index.html","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils","text":"julia> @test isapprox(@thunk 2*2.0, 4.0)\nTest Failed at REPL[52]:1\n  Expression: isapprox(#= REPL[52]:1 =# @thunk((2 * 2.0, 4.0)))\n   Evaluated: isapprox(Thunk(var\"#24#25\"()))\nERROR: There was an error during testing","category":"page"},{"location":"index.html","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils","text":"which should have passed the test.","category":"page"},{"location":"index.html#API-Documentation","page":"ChainRulesTestUtils","title":"API Documentation","text":"","category":"section"},{"location":"index.html","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils","text":"Modules = [ChainRulesTestUtils]\nPrivate = false","category":"page"},{"location":"index.html#ChainRulesTestUtils.:⊢","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils.:⊢","text":"primal ⊢ tangent\n\nInfix shorthand method to construct a PrimalAndTangent. Enter via \\vdash + tab on supporting editors.\n\n\n\n\n\n","category":"type"},{"location":"index.html#ChainRulesTestUtils.TestIterator","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils.TestIterator","text":"TestIterator{T,IS<:Base.IteratorSize,IE<:Base.IteratorEltype}\n\nA configurable iterator for testing purposes.\n\nTestIterator(data, itersize, itereltype)\nTestIterator(data)\n\nThe iterator wraps another iterator data, such as an array, that must have at least as many features implemented as the test iterator and have a FiniteDifferences.to_vec overload. By default, the iterator it has the same features as data.\n\nThe optional methods eltype, length, and size are automatically defined and forwarded to data if the type arguments indicate that they should be defined.\n\n\n\n\n\n","category":"type"},{"location":"index.html#ChainRulesTestUtils.check_equal-Tuple{Union{Number, AbstractArray{var\"#s87\",N} where N where var\"#s87\"<:Number},Union{Number, AbstractArray{var\"#s88\",N} where N where var\"#s88\"<:Number}}","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils.check_equal","text":"check_equal(actual, expected; kwargs...)\n\n@test's  that actual ≈ expected, but breaks up data such that human readable results are shown on failures. Understands things like unthunking ChainRuleCore.Thunks, etc. All keyword arguments are passed to isapprox.\n\n\n\n\n\n","category":"method"},{"location":"index.html#ChainRulesTestUtils.test_frule-Tuple{Any,Vararg{Any,N} where N}","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils.test_frule","text":"test_frule(f, inputs...; kwargs...)\n\nArguments\n\nf: Function for which the frule should be tested.\ninputs either the primal inputs x, or primals and their tangents: x ⊢ ẋ\nx: input at which to evaluate f (should generally be set to an arbitary point in the domain).\nẋ: differential w.r.t. x, will be generated automatically if not provided Non-differentiable arguments, such as indices, should have ẋ set as nothing.\n\nKeyword Arguments\n\noutput_tangent tangent to test accumulation of derivatives against should be a differential for the output of f. Is set automatically if not provided.\nfdm::FiniteDifferenceMethod: the finite differencing method to use.\nIf check_inferred=true, then the inferrability of the rrule is checked\nIf check_inferred=true, then the inferrability of the frule is checked, as long as f is itself inferrable.\nfkwargs are passed to f as keyword arguments.\nAll remaining keyword arguments are passed to isapprox.\n\n\n\n\n\n","category":"method"},{"location":"index.html#ChainRulesTestUtils.test_rrule-Tuple{Any,Vararg{Any,N} where N}","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils.test_rrule","text":"test_rrule(f, inputs...; kwargs...)\n\nArguments\n\nf: Function to which rule should be applied.\ninputs either the primal inputs x, or primals and their tangents: x ⊢ ẋ\nx: input at which to evaluate f (should generally be set to an arbitary point in the domain).\nx̄: currently accumulated cotangent, will be generated automatically if not provided Non-differentiable arguments, such as indices, should have x̄ set as nothing.\n\nKeyword Arguments\n\noutput_tangent the seed to propagate backward for testing (techncally a cotangent). should be a differential for the output of f. Is set automatically if not provided.\nfdm::FiniteDifferenceMethod: the finite differencing method to use.\nIf check_inferred=true, then the inferrability of the rrule is checked — if f is itself inferrable — along with the inferrability of the pullback it returns.\nfkwargs are passed to f as keyword arguments.\nAll remaining keyword arguments are passed to isapprox.\n\n\n\n\n\n","category":"method"},{"location":"index.html#ChainRulesTestUtils.test_scalar-Tuple{Any,Any}","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils.test_scalar","text":"test_scalar(f, z; rtol=1e-9, atol=1e-9, fdm=central_fdm(5, 1), fkwargs=NamedTuple(), check_inferred=true, kwargs...)\n\nGiven a function f with scalar input and scalar output, perform finite differencing checks, at input point z to confirm that there are correct frule and rrules provided.\n\nArguments\n\nf: Function for which the frule and rrule should be tested.\nz: input at which to evaluate f (should generally be set to an arbitary point in the domain).\n\nfkwargs are passed to f as keyword arguments. If check_inferred=true, then the type-stability of the frule and rrule are checked. All remaining keyword arguments are passed to isapprox.\n\n\n\n\n\n","category":"method"},{"location":"index.html","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils","text":"ChainRulesTestUtils.rand_tangent","category":"page"},{"location":"index.html#ChainRulesTestUtils.rand_tangent","page":"ChainRulesTestUtils","title":"ChainRulesTestUtils.rand_tangent","text":"rand_tangent([rng::AbstractRNG,] x)\n\nReturns a randomly generated tangent vector appropriate for the primal value x.\n\n\n\n\n\n","category":"function"}]
}
